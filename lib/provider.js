'use babel';

import fs from 'fs';
import path from 'path';

// Package settings
import meta from '../package.json';
const debug = atom.config.get(`${meta.name}.debug`);
const notEligible = `**${meta.name}**: \`nsL.jar\` is not in your \`config.cson\``;
const pathToScript = atom.config.get(`${meta.name}.pathToScript`);
const nslScript = pathToScript ? '"' + pathToScript + '"' : path.join(__dirname, 'nsl.cmd');
const nslJar = atom.config.get(`${meta.name}.pathToJar`);

// This package depends on build, make sure it's installed
require('atom-package-deps').install(meta.name);

export function provideBuilder() {
  return class nslProvider {
    constructor(cwd) {
      this.cwd = cwd;

      // Settings?
      if (!atom.config.get('build-nsl.pathToJar')) {
        atom.config.set('build-nsl.pathToJar', '');
      }
    }

    getNiceName() {
      return 'nsL Assembler';
    }

    isEligible() {
      try {
        fs.accessSync(nslJar, fs.F_OK);
      } catch (error) {
        // Warn only
        if (debug === true) atom.notifications.addError(notEligible, { detail: error, dismissable: true });
      }
      return true;
    }

    settings() {
      return [
        {
          name: 'nsL Assembler (Windows)',
          exec: nslScript,
          args: [ '{FILE_ACTIVE}' ],
          cwd: '{FILE_ACTIVE_PATH}',
          sh: true,
          keymap: 'cmd-alt-b',
          atomCommandName: 'nsl-assembler:compile-on-windows'
        },
        {
          name: 'nsL Assembler',
          exec: 'java',
          args: [ '-jar', nslJar, '{FILE_ACTIVE}' ],
          cwd: '{FILE_ACTIVE_PATH}',
          sh: false,
          keymap: 'cmd-alt-b',
          atomCommandName: 'nsl-assembler:compile'
        }
      ];
    }
  };
}
