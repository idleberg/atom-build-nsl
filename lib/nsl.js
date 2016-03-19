'use babel';

import glob from 'glob';

function isEligable(cwd) {
  if (glob.sync('*.@(nsl)', {cwd}).length >= 1) {
    return true;
  }
  return false;
}

function settings(path) {
  let jarPath = atom.config.get('build-nsl.pathToJar');

  return {
    exec: 'java',
    args: [ "-jar", jarPath, "{FILE_ACTIVE}" ],
    cwd: "{PROJECT_PATH}",
    sh: false,
    atomCommandName: 'build-nsl:translate-script'
  };
}

export function provideBuilder() {
  return {
    niceName: 'nsL Assembler',
    isEligable,
    settings
  };
}
