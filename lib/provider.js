'use babel';

import fs from 'fs';

const nslJar = atom.config.get('build-nsl.pathToJar');

export function provideBuilder() {

  return class MakensisProvider {
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
      
      return {
        name: 'nsL Assembler',
        exec: 'java',
        args: [ '-jar', nslJar, '{FILE_ACTIVE}' ],
        cwd: cwdPath,
        sh: false,
        atomCommandName: 'nsl-assembler:compile'
        // errorMatch: [ 'Error in script "(?<file>[^"]+)" on line (?<line>\\d+):\\n\\s+(?<error>\\b.*)' ]
      }
    }
  }
}
