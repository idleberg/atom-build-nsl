'use babel';

import { EventEmitter } from 'events';
import { spawnSync } from 'child_process';
import fs from 'fs';

// Package settings
import meta from '../package.json';

this.config = {
  pathToJar: {
    title: "Path to JAR",
    description: "Specify the full path to `nsL.jar`",
    type: "string",
    default: "",
    order: 0
  },
  customArguments: {
    title: "Custom Arguments",
    description: "Specify your preferred arguments for nsL Assembler",
    type: "string",
    default: "/nomake /nopause",
    order: 1
  },
  manageDependencies: {
    title: 'Manage Dependencies',
    description: 'When enabled, third-party dependencies will be installed automatically',
    type: 'boolean',
    default: true,
    order: 2
  }
};

// This package depends on build, make sure it's installed
export function activate() {
  if (atom.config.get('build-makensis-wine.manageDependencies')) {
    this.satisfyDependencies();
  }
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
      // First, check for Java
      try {
        spawnSync('java -version');
      } catch (error) {
        if (atom.inDevMode()) atom.notifications.addError(meta.name, { detail: error, dismissable: true });
        return false;
      }

      // Second, check for nsL.jar
      let pathToJar = atom.config.get('build-nsl.pathToJar');

      try {
        fs.accessSync(pathToJar, fs.F_OK);
      } catch (error) {
        // Warn only
        if (atom.inDevMode()) atom.notifications.addWarning(meta.name, { detail: error, dismissable: true });
      }

      return true;
    }

    settings() {
      let pathToJar = atom.config.get('build-nsl.pathToJar');

      let defaultArguments = ['-jar', pathToJar]
      let customArguments = atom.config.get('build-nsl.customArguments').trim().split(" ");
      let args = defaultArguments.concat(customArguments);
      args.push("{FILE_ACTIVE}");

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
          errorMatch: errorMatch,
        }
      ];
    }
  };
}
