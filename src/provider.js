'use babel';

import meta from '../package.json';
import { EventEmitter } from 'events';
import { configSchema, getConfig } from './config';
import { existsSync } from 'fs';
import { satisfyDependencies, which } from './util';
import { spawnSync } from 'child_process';

export { configSchema as config };

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
      if (getConfig('alwaysEligible') === true) {
        return true;
      }

      // First, check for Java
      const whichCmd = spawnSync(which(), ['java']);

      if (!whichCmd.stdout || !whichCmd.stdout.toString()) {
        return false;
      }

      // Second, check for nsL.jar
      const pathToJar = getConfig('pathToJar');

      if (existsSync(pathToJar)) {
        return true;
      }

      // Warn only
      if (getConfig('mutePathWarning') === false) {
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
      const pathToJar = getConfig('pathToJar');

      const defaultArguments = ['-jar', pathToJar];
      const customArguments = getConfig('customArguments');
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
export async function activate() {
  if (getConfig('manageDependencies') === true) {
    satisfyDependencies();
  }
}
