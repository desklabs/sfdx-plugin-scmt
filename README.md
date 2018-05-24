scmt
====

Plugin for SCMT development.

[![Version](https://img.shields.io/npm/v/sfdx-plugin-scmt.svg)](https://npmjs.org/package/sfdx-plugin-scmt)
[![Downloads/week](https://img.shields.io/npm/dw/scmt.svg)](https://npmjs.org/package/scmt)
[![License](https://img.shields.io/npm/l/scmt.svg)](https://github.com/desklabs/sfdx-plugin-scmt/blob/master/package.json)

<!-- toc -->
* [Debugging your plugin](#debugging-your-plugin)
<!-- tocstop -->
<!-- install -->
<!-- usage -->
```sh-session
$ npm install -g scmt
$ scmt COMMAND
running command...
$ scmt (-v|--version|version)
scmt/0.0.1 darwin-x64 node-v9.11.1
$ scmt --help [COMMAND]
USAGE
  $ scmt COMMAND
...
```
<!-- usagestop -->
<!-- commands -->
* [`scmt scmt:audit:enable`](#scmt-scmtauditenable)

## `scmt scmt:audit:enable`

enables 'Set Audit Fields upon Record Creation' and 'Update Records with Inactive Owners' user permissions

```
USAGE
  $ scmt scmt:audit:enable

OPTIONS
  -u, --targetusername=targetusername             username or alias for the target org; overrides default target org
  --apiversion=apiversion                         override the api version used for api requests made by this command
  --json                                          format output as json
  --loglevel=(trace|debug|info|warn|error|fatal)  logging level for this command invocation

EXAMPLES
  $ sfdx scmt:audit:enable

  $ sfdx scmt:audit:enable --targetusername myOrg@example.com
```

_See code: [src/commands/scmt/audit/enable.ts](https://github.com/desklabs/sfdx-plugin-scmt/blob/v0.0.1/src/commands/scmt/audit/enable.ts)_
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
