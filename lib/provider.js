'use babel';

import { EventEmitter } from 'events';
import { existsSync } from 'fs';
import { platform} from 'os';
import { spawnSync } from 'child_process';

// Package settings
import meta from '../package.json';

this.config = {
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

// This package depends on build, make sure it's installed
export function activate() {
  if (atom.config.get(meta.name + '.manageDependencies') && !atom.inSpecMode()) {
    this.satisfyDependencies();
  }
}

export function which() {
  if (platform() === 'win32') {
    return 'where';
  }
  return 'which';
}

export function satisfyDependencies() {
  let k;
  let v;

  require('atom-package-deps').install(meta.name);

  const ref = meta['package-deps'];
  const results = [];

  for (k in ref) {
    if (typeof ref !== 'undefined' && ref !== null) {
      v = ref[k];
      if (atom.packages.isPackageDisabled(v)) {
        if (atom.inDevMode()) {
          console.log('Enabling package \'' + v + '\'');
        }
        results.push(atom.packages.enablePackage(v));
      } else {
        results.push(void 0);
      }
    }
  }
  return results;
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
      if (atom.config.get(meta.name + '.alwaysEligible') === true) {
        return true;
      }

      // First, check for Java
      const cmd = spawnSync(which(), ['java']);
      if (!cmd.stdout.toString()) {
        return false;
      }

      // Second, check for nsL.jar
      const pathToJar = atom.config.get(meta.name + '.pathToJar');

      if (existsSync(pathToJar)) {
        return true;
      }

      // Warn only
      if (atom.config.get(meta.name + '.mutePathWarning') === false) {
        const notification = atom.notifications.addWarning(`**${meta.name}**: No valid \`nsL.jar\` was specified in your settings`, {
          dismissable: true,
          buttons: [
            {
              text: 'Open Settings',
              onDidClick: function () {
                atom.workspace.open('atom://config/packages/' + meta.name);
                notification.dismiss();
              }
            },
            {
              text: 'Ignore',
              onDidClick: function () {
                atom.config.set(meta.name + '.mutePathWarning', true);
                notification.dismiss();
              }
            }
          ]
        });
      }

      return false;
    }

    settings() {
      const pathToJar = atom.config.get(meta.name + '.pathToJar');

      const defaultArguments = ['-jar', pathToJar];
      const customArguments = atom.config.get(meta.name + '.customArguments').trim().split(' ');
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
