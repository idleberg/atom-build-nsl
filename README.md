# build-nsl

[![apm](https://img.shields.io/apm/l/build-nsl.svg?style=flat-square)](https://atom.io/packages/build-nsl)
[![apm](https://img.shields.io/apm/v/build-nsl.svg?style=flat-square)](https://atom.io/packages/build-nsl)
[![apm](https://img.shields.io/apm/dm/build-nsl.svg?style=flat-square)](https://atom.io/packages/build-nsl)
[![Travis](https://img.shields.io/travis/idleberg/atom-build-nsl.svg?style=flat-square)](https://travis-ci.org/idleberg/atom-build-nsl)
[![David](https://img.shields.io/david/idleberg/atom-build-nsl.svg?style=flat-square)](https://david-dm.org/idleberg/atom-build-nsl)
[![David](https://img.shields.io/david/dev/idleberg/atom-build-nsl.svg?style=flat-square)](https://david-dm.org/idleberg/atom-build-nsl?type=dev)
[![Gitter](https://img.shields.io/badge/chat-Gitter-ed1965.svg?style=flat-square)](https://gitter.im/NSIS-Dev/Atom)

[Atom Build](https://atombuild.github.io/) for nsL Assembler, translates nsL code into NSIS scripts

## Installation

### apm

Install `build-nsl` from Atom's [Package Manager](http://flight-manual.atom.io/using-atom/sections/atom-packages/) or the command-line equivalent:

`$ apm install build-nsl`

### Using Git

Change to your Atom packages directory:

```bash
# Windows
$ cd %USERPROFILE%\.atom\packages

# Linux & macOS
$ cd ~/.atom/packages/
```

Clone repository as `build-nsl`:

```bash
$ git clone https://github.com/idleberg/atom-build-nsl build-nsl
```

Inside the cloned directory, install Node dependencies:

```bash
$ yarn || npm install
```

## Configuration

Before you can build, you need to specify the path to your `nsL.jar` in the package settings.

**Example**:

```cson
"build-nsl":
    pathToJar: "/path/to/nsL.jar"
```

## Usage

Before you can build, select an active target with your preferred build option.

Available targets:

* `nsL Assembler` – compiles using manually specified path to `nsL.jar`

#### Path to JAR

When you can't use the Windows batch file, you need to specify a custom path for `nsL.jar` in your Atom [configuration](http://flight-manual.atom.io/using-atom/sections/basic-customization/#_global_configuration_settings):

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