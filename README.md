[![apm](https://img.shields.io/apm/l/build-nsl.svg?style=flat-square)](https://atom.io/packages/build-nsl)
[![apm](https://img.shields.io/apm/v/build-nsl.svg?style=flat-square)](https://atom.io/packages/build-nsl)
[![apm](https://img.shields.io/apm/dm/build-nsl.svg?style=flat-square)](https://atom.io/packages/build-nsl)
[![Travis](https://img.shields.io/travis/idleberg/atom-build-nsl.svg?style=flat-square)](https://travis-ci.org/idleberg/atom-build-nsl)
[![David](https://img.shields.io/david/dev/idleberg/atom-build-nsl.svg?style=flat-square)](https://david-dm.org/idleberg/atom-build-nsl#info=dependencies)
[![Gitter](https://img.shields.io/badge/chat-Gitter-ff69b4.svg?style=flat-square)](https://gitter.im/NSIS-Dev/Atom)

# build-nsl

[Atom Build](https://atombuild.github.io/) for nsL Assembler, translates nsL code into NSIS scripts

## Installation

### apm

* Install package `apm install build-nsl` (or use the GUI)

### GitHub

1. Change directory `cd ~/.atom/packages/`
2. Clone repository `git clone https://github.com/idleberg/atom-build-nsl build-nsl`

## Configuration

Before you can build, you need to specify the path to your `nsL.jar` in your Atom configuration.

```cson
"build-nsl":
    pathToJar: "/path/to/nsL.jar"
```

## Usage

Before you can build, select an active target with your preferred build option.

Available targets:

* `nsL Assembler (Windows)` – runs batch script, detecting installed `nsL.jar`, then compiling
* `nsL Assembler` – compiles using manually specified path to `nsL.jar`

#### Path to JAR

When you can't use the Windows batch file, you need to specify a custom path for `nsL.jar` in your `config.cson`:

```cson
 "build-nsl":
    pathToJar: "path/to/BridleNSIS.jar"
 ```

### Shortcuts

Here's a reminder of the default shortcuts you can use with this package:

**Choose target**

<kbd>Super</kbd>+<kbd>Alt</kbd>+<kbd>T</kbd> or <kbd>F7</kbd>

**Toggle build panel**

<kbd>Super</kbd>+<kbd>Alt</kbd>+<kbd>V</kbd> or <kbd>F8</kbd>

**Build script**

<kbd>Super</kbd>+<kbd>Alt</kbd>+<kbd>B</kbd> or <kbd>F9</kbd>

## License

This work is dual-licensed under [The MIT License](https://opensource.org/licenses/MIT) and the [GNU General Public License, version 2.0](https://opensource.org/licenses/GPL-2.0)

## Donate

You are welcome support this project using [Flattr](https://flattr.com/submit/auto?user_id=idleberg&url=https://github.com/idleberg/atom-build-nsl) or Bitcoin `17CXJuPsmhuTzFV2k4RKYwpEHVjskJktRd`