'use babel';

import os from 'os';
import glob from 'glob';

function isEligable(cwd) {
  if (glob.sync('*.@(nsl)', {cwd}).length >= 1) {
    return true;
  }
  return false;
}

function settings(path) {
  let nsl_jar = atom.config.get('build-nsl.jarPath');

  return {
    exec: 'java',
    args: [ "-jar", nsl_jar, "{FILE_ACTIVE}" ],
    cwd: "{PROJECT_PATH}",
    sh: false,
    errorMatch: [
      'Error in script "(?<file>[^"]+)" on line (?<line>\\d+)'
    ]
  };
}

export function provideBuilder() {
  return {
    niceName: 'nsL Assembler',
    isEligable,
    settings
  };
}
