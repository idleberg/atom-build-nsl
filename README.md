# build-nsl

[![apm](https://flat.badgen.net/apm/license/build-nsl)](https://atom.io/packages/build-nsl)
[![apm](https://flat.badgen.net/apm/v/build-nsl)](https://atom.io/packages/build-nsl)
[![apm](https://flat.badgen.net/apm/dl/build-nsl)](https://atom.io/packages/build-nsl)
[![CircleCI](https://flat.badgen.net/circleci/github/idleberg/atom-build-nsl)](https://circleci.com/gh/idleberg/atom-build-nsl)
[![David](https://flat.badgen.net/david/dev/idleberg/atom-build-nsl)](https://david-dm.org/idleberg/atom-build-nsl?type=dev)

[Atom Build](https://atombuild.github.io/) for nsL Assembler, transpiles nsL code into NSIS scripts. Supports the [linter](https://atom.io/packages/linter) package for error highlighting.

## Installation

### apm

Install `build-nsl` from Atom's [Package Manager](http://flight-manual.atom.io/using-atom/sections/atom-packages/) or the command-line equivalent:

`$ apm install build-nsl`

### Using Git

Change to your Atom packages directory:

**Windows**

```powershell
# Powershell
$ cd $Env:USERPROFILE\.atom\packages
```

```cmd
:: Command Prompt
$ cd %USERPROFILE%\.atom\packages
```

**Linux & macOS**

```bash
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

You should now be setup to build the package:

```bash
$ yarn build || npm run build
```

## Configuration

Make sure to specify the path to your `nsL.jar` in the package settings.

**Example**:

```cson
"build-nsl":
    pathToJar: "%PROGRAMFILES(X86)%\\NSIS\\NSL\\nsL.jar"
```

## Usage

Before you can build, select an active target with your preferred build option.

Available targets:

* `nsL Assembler` – transpiles script

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
