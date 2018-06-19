import { flags } from '@oclif/command'
import { core } from '@salesforce/command'
import CommandBase from '../../../command_base'

// Initialize Messages with the current plugin directory
core.Messages.importMessagesDirectory(__dirname);

// Load the specific messages for this file. Messages from @salesforce/command, @salesforce/core,
// or any library that is using the messages framework can also be loaded this way.
const messages = core.Messages.loadMessages('@desklabs/scmt', 'audit');

export default class Enable extends CommandBase {
  public static description = messages.getMessage('enableCommandDescription');
  public static examples = [
    `$ sfdx scmt:audit:enable`,
    `$ sfdx scmt:audit:enable --targetusername myOrg@example.com`
  ];

  protected static requiresUsername = true;
  protected static requiresProject = true;

  public async run(): Promise<any> { // tslint:disable-line:no-any
    await this.page.goto(this.buildUrl('/ui/setup/org/UserInterfaceUI'));
    await this.page.waitFor('#auditFieldInactiveOwner');
    await this.page.evaluate(`document.querySelector("#auditFieldInactiveOwner").checked = true;`);
    await Promise.all([
      this.page.waitForNavigation(),
      (await this.page.$("input[title='Save']")).click()
    ]);

    let outputString = `Enabled "Set Audit Fields upon Record Creation" and "Update Records with Inactive Owners" User Permissions`;
    this.ux.log(outputString);
    return { outputString };
  }
}
