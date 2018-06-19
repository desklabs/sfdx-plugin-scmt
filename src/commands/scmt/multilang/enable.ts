/*
 * Filename: /Users/edahl/Documents/GitHub/sfdx-plugin-scmt/src/commands/scmt/multilang/enable.ts
 * Path: /Users/edahl/Documents/GitHub/sfdx-plugin-scmt
 * Created Date: Monday, June 18th 2018, 1:32:26 pm
 * Author: edahl
 *
 * Copyright (c) 2018 Your Company
 */


import { flags } from '@oclif/command'
import { core } from '@salesforce/command'
import CommandBase, { PropertyType } from '../../../command_base'

// Initialize Messages with the current plugin directory
core.Messages.importMessagesDirectory(__dirname);

// Load the specific messages for this file. Messages from @salesforce/command, @salesforce/core,
// or any library that is using the messages framework can also be loaded this way.
const messages = core.Messages.loadMessages('@desklabs/scmt', 'multilang');

export default class Enable extends CommandBase {
  public static description = messages.getMessage('enableCommandDescription');
  public static examples = [
    `$ sfdx scmt:multilang:enable`,
    `$ sfdx scmt:multilang:enable --targetusername myOrg@example.com`
  ];

  protected static requiresUsername = true;

  public async run(): Promise<any> { // tslint:disable-line:no-any
    let outputString = messages.getMessage('commandFinished');
    //navigate to KB settings edit page
    await this.page.goto(this.buildUrl('/_ui/support/knowledge/KnowledgeSettingsUI/e'));
    //check for multi
    let multiCheckbox = await this.page.$('#enableMultilingual1');
    if (multiCheckbox) {
      multiCheckbox.click();
    }
    //is de selected already? if not, select de and click it
    let germanSelected = await this.page.$('input[value=de]');
    if (!germanSelected) {
      await this.page.evaluate(`
        document.querySelector("#las_-1 [value=de]").selected = true;
        document.querySelector('#las_-1').dispatchEvent(new Event('change'));
      `);

    }

    //figure out row number and build string for the active checkbox
    let rownum = await this.page.evaluate(`document.querySelectorAll("#langtbl tr").length - 3`);
    let fieldStr = '#st_' + rownum; //#st_3

    let germanActive = await this.page.$(fieldStr);
    if (germanActive) {
      await this.page.evaluate(`document.querySelector("` + fieldStr + `").checked = true;`); //`document.querySelector("#st_3").checked = true;`
    }

    await this.page.click('input[title="Save"]');

    this.ux.log(outputString);
    return { outputString };
  }
}
