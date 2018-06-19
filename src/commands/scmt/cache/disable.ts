import { flags } from '@oclif/command'
import { core } from '@salesforce/command'
import CommandBase from '../../../command_base'

// Initialize Messages with the current plugin directory
core.Messages.importMessagesDirectory(__dirname);

// Load the specific messages for this file. Messages from @salesforce/command, @salesforce/core,
// or any library that is using the messages framework can also be loaded this way.
const messages = core.Messages.loadMessages('@desklabs/scmt', 'cache');

export default class Disable extends CommandBase {
  public static description = messages.getMessage('disableCommandDescription');
  public static examples = [
    `$ sfdx scmt:cache:disable`,
    `$ sfdx scmt:cache:disable --targetusername myOrg@example.com`
  ];

  protected static requiresUsername = true;
  protected static requiresProject = true;

  public async run(): Promise<any> { // tslint:disable-line:no-any
    await this.page.goto(this.buildUrl('/_ui/system/security/SessionSettings'));
    await this.page.waitFor('#p23');
    await this.page.evaluate(`document.querySelector("#p23").checked = false;`);
    await Promise.all([
      this.page.waitForNavigation(),
      (await this.page.$("input[title='Save']")).click()
    ]);

    let outputString = `Disabled secure and persistent browser caching for development`;
    this.ux.log(outputString);
    return { outputString };
  }
}
