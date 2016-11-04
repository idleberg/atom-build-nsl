'use babel';

import { install } from 'atom-package-deps';
import { EventEmitter } from 'events';
import fs from 'fs';
import os from 'os';
import path from 'path';

// Package settings
import meta from '../package.json';

this.config = {
  pathToJar: {
    title: "Path to JAR",
    description: "Specify the path to `nsL.jar`",
    type: "string",
    "default": path.join(__dirname, 'nsl.cmd'),
    order: 0
  },
  pathToScript: {
    title: "Path to Script",
    description: "Specify the path to `nsl.cmd`",
    type: "string",
    "default": path.join(__dirname, 'nsl.cmd'),
    order: 1
  }
};

// This package depends on build, make sure it's installed
export function activate() {
  if (!atom.inSpecMode()) {
    install(meta.name);
  }
}

export function provideBuilder() {
  return class nslProvider extends EventEmitter  {
    constructor(cwd) {
      super();
      this.cwd = cwd;
      atom.config.observe('build-nsl.pathToJar', () => this.emit('refresh'));
      atom.config.observe('build-nsl.pathToScript', () => this.emit('refresh'));
    }

    getNiceName() {
      return 'nsL Assembler';
    }

    isEligible() {
      let nslJar = atom.config.get('build-nsl.pathToJar');

      try {
        fs.accessSync(nslJar, fs.F_OK);
      } catch (error) {
        // Warn only
        if (atom.inDevMode()) atom.notifications.addError(meta.name, { detail: error, dismissable: true });
      }
      return true;
    }

    settings() {
      let args;

      if (os.platform() === 'win32') {
        exec = atom.config.get('build-nsl.pathToScript');
        args = [ '{FILE_ACTIVE}' ];
      } else {
        let nslJar = atom.config.get('build-nsl.pathToJar');
        exec = 'java'
        args = [ '-jar', nslJar, '/nopause', '/nomake', '{FILE_ACTIVE}' ];
      }

      return [
        {
          name: 'nsL Assembler',
          exec: exec,
          args: args,
          cwd: '{FILE_ACTIVE_PATH}',
          sh: false,
          keymap: 'cmd-alt-b',
          atomCommandName: 'nsl-assembler:compile'
        }
      ];
    }
  };
}
