scmt
====

Plugin for SCMT development.

[![Version](https://img.shields.io/npm/v/@desklabs/scmt.svg)](https://npmjs.org/package/@desklabs/scmt)
[![Downloads/week](https://img.shields.io/npm/dw/@desklabs/scmt.svg)](https://npmjs.org/package/@desklabs/scmt)
[![License](https://img.shields.io/npm/l/@desklabs/scmt.svg)](https://github.com/desklabs/sfdx-plugin-scmt/blob/master/package.json)

<!-- toc -->
* [Debugging your plugin](#debugging-your-plugin)
<!-- tocstop -->
<!-- install -->
<!-- usage -->
```sh-session
$ npm install -g @desklabs/scmt
$ @desklabs/scmt COMMAND
running command...
$ @desklabs/scmt (-v|--version|version)
@desklabs/scmt/0.0.5 darwin-x64 node-v9.11.1
$ @desklabs/scmt --help [COMMAND]
USAGE
  $ @desklabs/scmt COMMAND
...
```
<!-- usagestop -->
<!-- commands -->
* [`@desklabs/scmt scmt:audit:enable`](#desklabs-scmt-scmtauditenable)
* [`@desklabs/scmt scmt:cache:disable`](#desklabs-scmt-scmtcachedisable)
* [`@desklabs/scmt scmt:multilang:enable`](#desklabs-scmt-scmtmultilangenable)
* [`@desklabs/scmt scmt:test:run`](#desklabs-scmt-scmttestrun)

## `@desklabs/scmt scmt:audit:enable`

enables 'Set Audit Fields upon Record Creation' and 'Update Records with Inactive Owners' user permissions

```
USAGE
  $ @desklabs/scmt scmt:audit:enable

OPTIONS
  -u, --targetusername=targetusername             username or alias for the target org; overrides default target org
  --apiversion=apiversion                         override the api version used for api requests made by this command
  --json                                          format output as json
  --loglevel=(trace|debug|info|warn|error|fatal)  logging level for this command invocation

EXAMPLES
  $ sfdx scmt:audit:enable

  $ sfdx scmt:audit:enable --targetusername myOrg@example.com
```

_See code: [src/commands/scmt/audit/enable.ts](https://github.com/desklabs/sfdx-plugin-scmt/blob/v0.0.5/src/commands/scmt/audit/enable.ts)_

## `@desklabs/scmt scmt:cache:disable`

disables secure and persistent browser caching for development

```
USAGE
  $ @desklabs/scmt scmt:cache:disable

OPTIONS
  -u, --targetusername=targetusername             username or alias for the target org; overrides default target org
  --apiversion=apiversion                         override the api version used for api requests made by this command
  --json                                          format output as json
  --loglevel=(trace|debug|info|warn|error|fatal)  logging level for this command invocation

EXAMPLES
  $ sfdx scmt:cache:disable

  $ sfdx scmt:cache:disable --targetusername myOrg@example.com
```

_See code: [src/commands/scmt/cache/disable.ts](https://github.com/desklabs/sfdx-plugin-scmt/blob/v0.0.5/src/commands/scmt/cache/disable.ts)_

## `@desklabs/scmt scmt:multilang:enable`

Enables 'Multi-Languange' and 'Adds German Translations'

```
USAGE
  $ @desklabs/scmt scmt:multilang:enable

OPTIONS
  -u, --targetusername=targetusername             username or alias for the target org; overrides default target org
  --apiversion=apiversion                         override the api version used for api requests made by this command
  --json                                          format output as json
  --loglevel=(trace|debug|info|warn|error|fatal)  logging level for this command invocation

EXAMPLES
  $ sfdx scmt:multilang:enable

  $ sfdx scmt:multilang:enable --targetusername myOrg@example.com
```

_See code: [src/commands/scmt/multilang/enable.ts](https://github.com/desklabs/sfdx-plugin-scmt/blob/v0.0.5/src/commands/scmt/multilang/enable.ts)_

## `@desklabs/scmt scmt:test:run`

runs a migration end to end

```
USAGE
  $ @desklabs/scmt scmt:test:run

OPTIONS
  -e, --endpoint=endpoint                         (required) endpoint for the Desk.com instance
  -m, --migration=article|case                    [default: article] migration to run
  -n, --username=username                         (required) username for the Desk.com instance
  -p, --password=password                         (required) password for the Desk.com instance
  -u, --targetusername=targetusername             username or alias for the target org; overrides default target org
  --apiversion=apiversion                         override the api version used for api requests made by this command
  --json                                          format output as json
  --loglevel=(trace|debug|info|warn|error|fatal)  logging level for this command invocation

EXAMPLES
  $ sfdx scmt:test:run -u test-6wc4l7uohg0h@example.com -e https://domain.desk.com -n user@domain.com -p password

  $ sfdx scmt:test:run -u test-6wc4l7uohg0h@example.com -e https://domain.desk.com -n user@domain.com -p password -m 
  case
```

_See code: [src/commands/scmt/test/run.ts](https://github.com/desklabs/sfdx-plugin-scmt/blob/v0.0.5/src/commands/scmt/test/run.ts)_
<!-- commandsstop -->
<!-- debugging-your-plugin -->
# Debugging your plugin
We recommend using the Visual Studio Code (VS Code) IDE for your plugin development. Included in the `.vscode` directory of this plugin is a `launch.json` config file, which allows you to attach a debugger to the node process when running your commands.

To debug the `scmt:audit` command: 
1. Start the inspector
  
If you linked your plugin to the sfdx cli, call your command with the `dev-suspend` switch: 
```sh-session
$ sfdx scmt:audit:enable -u myOrg@example.com --dev-suspend
```
  
Alternatively, to call your command using the `bin/run` script, set the `NODE_OPTIONS` environment variable to `--inspect-brk` when starting the debugger:
```sh-session
$ NODE_OPTIONS=--inspect-brk bin/run scmt:audit:enable -u myOrg@example.com
```

2. Set some breakpoints in your command code
3. Click on the Debug icon in the Activity Bar on the side of VS Code to open up the Debug view.
4. In the upper left hand corner of VS Code, verify that the "Attach to Remote" launch configuration has been chosen.
5. Hit the green play button to the left of the "Attach to Remote" launch configuration window. The debugger should now be suspended on the first line of the program. 
6. Hit the green play button at the top middle of VS Code (this play button will be to the right of the play button that you clicked in step #5).
<br><img src=".images/vscodeScreenshot.png" width="480" height="278"><br>
Congrats, you are debugging!
