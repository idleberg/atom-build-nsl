'use babel';

import { EventEmitter } from 'events';
import { install } from 'atom-package-deps';
import { existsSync } from 'fs';
import { platform} from 'os';
import { spawn } from 'child_process';

// Package settings
import meta from '../package.json';

export const config = {
  pathToJar: {
    title: 'Path to JAR',
    description: 'Specify the full path to `nsL.jar`',
    type: 'string',
    default: '',
    order: 0
  },
  mutePathWarning: {
    title: 'Mute Warning',
    description: 'When enabled, warnings about missing path to `nsL.jar` will be muted',
    type: 'boolean',
    default: false,
    order: 1
  },
  customArguments: {
    title: 'Custom Arguments',
    description: 'Specify your preferred arguments for nsL Assembler',
    type: 'string',
    default: '/nomake /nopause',
    order: 2
  },
  manageDependencies: {
    title: 'Manage Dependencies',
    description: 'When enabled, third-party dependencies will be installed automatically',
    type: 'boolean',
    default: true,
    order: 3
  },
  alwaysEligible: {
    title: 'Always Eligible',
    description: 'The build provider will be available in your project, even when not eligible',
    type: 'boolean',
    default: false,
    order: 4
  }
};

export function satisfyDependencies() {
  install(meta.name);

  const packageDeps = meta['package-deps'];

  packageDeps.forEach( packageDep => {
    if (packageDep) {
      if (atom.packages.isPackageDisabled(packageDep)) {
        if (atom.inDevMode()) console.log(`Enabling package '${packageDep}\'`);
        atom.packages.enablePackage(packageDep);
      }
    }
  });
}

function spawnPromise(cmd, args) {
  return new Promise(function (resolve, reject) {
    const child = spawn(cmd, args);
    let stdOut;
    let stdErr;

    child.stdout.on('data', function (line) {
      stdOut += line.toString().trim();
    });

    child.stderr.on('data', function (line) {
      stdErr += line.toString().trim();
    });

    child.on('close', function (code) {
      if (code === 0) {
        resolve(stdOut);
      }

      reject(stdErr);
    });
  });
}

export function which() {
  return (platform() === 'win32') ? 'where' : 'which';
}

export function provideBuilder() {
  return class nslProvider extends EventEmitter {
    constructor(cwd) {
      super();
      this.cwd = cwd;
      atom.config.observe('build-nsl.pathToJar', () => this.emit('refresh'));
      atom.config.observe('build-nsl.customArguments', () => this.emit('refresh'));
    }

    getNiceName() {
      return 'nsL Assembler';
    }

    isEligible() {
      if (atom.config.get(`${meta.name}.alwaysEligible`) === true) {
        return true;
      }

      // First, check for Java
      const whichCmd = spawnPromise(which(), ['java']);
      if (!whichCmd.stdout || !whichCmd.stdout.toString()) {
        return false;
      }

      // Second, check for nsL.jar
      const pathToJar = atom.config.get(`${meta.name}.pathToJar`);

      if (existsSync(pathToJar)) {
        return true;
      }

      // Warn only
      if (atom.config.get(`${meta.name}.mutePathWarning`) === false) {
        const notification = atom.notifications.addWarning(`**${meta.name}**: No valid \`nsL.jar\` was specified in your settings`, {
          dismissable: true,
          buttons: [
            {
              text: 'Open Settings',
              className: 'icon icon-gear',
              onDidClick: function () {
                atom.workspace.open('atom://config/packages/' + meta.name, {pending: true, searchAllPanes: true});
                notification.dismiss();
              }
            },
            {
              text: 'Ignore',
              onDidClick: function () {
                atom.config.set(`${meta.name}.mutePathWarning`, true);
                notification.dismiss();
              }
            }
          ]
        });
      }

      return false;
    }

    settings() {
      const pathToJar = atom.config.get(`${meta.name}.pathToJar`);

      const defaultArguments = ['-jar', pathToJar];
      const customArguments = atom.config.get(`${meta.name}.customArguments`).trim().split(' ');
      const args = defaultArguments.concat(customArguments);
      args.push('{FILE_ACTIVE}');

      const errorMatch = [
        'Error in script "(?<file>[^"]+)" on line (?<line>\\d+):\\r?\\n\\s*(?<message>.+)'
      ];

      return [
        {
          name: 'nsL Assembler',
          exec: 'java',
          args: args,
          cwd: '{FILE_ACTIVE_PATH}',
          sh: false,
          keymap: 'cmd-alt-b',
          errorMatch: errorMatch
        }
      ];
    }
  };
}

// This package depends on build, make sure it's installed
export function activate() {
  if (atom.config.get(`${meta.name}.manageDependencies`) === true) {
    satisfyDependencies();
  }
}
