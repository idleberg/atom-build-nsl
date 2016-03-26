'use babel';

import fs from 'fs';
import path from 'path';

const pathToScript = atom.config.get('build-nsl.pathToScript');
const nslScript = pathToScript ? '"' + pathToScript + '"' : path.join(__dirname, 'nsl.cmd');
const nslJar = atom.config.get('build-nsl.pathToJar');

export function provideBuilder() {

  return class nslProvider {
    constructor(cwd) {
      this.cwd = cwd;
    }

    getNiceName() {
      return 'nsL Assembler';
    }

    isEligible() {
      try {
          fs.accessSync(nslJar, fs.F_OK);
      } catch (e) {
          console.log('[build-nsl] ' + e)
          return false
      }
      return true;
    }

    settings() {
      const cwdPath = '{FILE_ACTIVE_PATH}';
      
      return [
        {
            name: 'nsL Assembler (Windows)',
            exec: nslScript,
            args: [ '{FILE_ACTIVE}' ],
            cwd: cwdPath,
            sh: true,
            keymap: 'cmd-alt-b',
            atomCommandName: 'nsl-assembler:compile-on-windows'
          },
          {
          name: 'nsL Assembler',
          exec: 'java',
          args: [ '-jar', nslJar, '{FILE_ACTIVE}' ],
          cwd: cwdPath,
          sh: false,
          keymap: 'cmd-alt-b',
          atomCommandName: 'nsl-assembler:compile'
        }
      ];
    }
  }
}