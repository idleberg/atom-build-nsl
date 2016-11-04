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
    description: "Specify the full path to `nsL.jar`",
    type: "string",
    "default": path.join(__dirname, 'nsl.cmd'),
    order: 0
  },
  pathToScript: {
    title: "Path to Script",
    description: "Specify the full path to `nsl.cmd`",
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
      let args, exec, sh;

      if (os.platform() === 'win32') {
        exec = atom.config.get('build-nsl.pathToScript');
        args = [ '{FILE_ACTIVE}' ];
        sh = true
      } else {
        let nslJar = atom.config.get('build-nsl.pathToJar');
        exec = 'java'
        args = [ '-jar', nslJar, '/nopause', '/nomake', '{FILE_ACTIVE}' ];
        sh = false;
      }

      const errorMatch = [
        'Error in script "(?<file>[^"]+)" on line (?<line>\\d+):\\r?\\n\\s*(?<message>.+)'
      ];

      return [
        {
          name: 'nsL Assembler',
          exec: exec,
          args: args,
          cwd: '{FILE_ACTIVE_PATH}',
          sh: sh,
          keymap: 'cmd-alt-b',
          errorMatch: errorMatch,
        }
      ];
    }
  };
}
