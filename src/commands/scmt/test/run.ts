import { flags } from '@oclif/command'
import { core } from '@salesforce/command'
import CommandBase from '../../../command_base'
import { runInThisContext } from 'vm';

// Initialize Messages with the current plugin directory
core.Messages.importMessagesDirectory(__dirname);

// Load the specific messages for this file. Messages from @salesforce/command, @salesforce/core,
// or any library that is using the messages framework can also be loaded this way.
const messages = core.Messages.loadMessages('@desklabs/scmt', 'test');
// async forEach method
const asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}

export default class Run extends CommandBase {
  public static description = messages.getMessage('runCommandDescription');
  public static examples = [
    `$ sfdx scmt:test:run`,
    `$ sfdx scmt:test:run --targetusername myOrg@example.com`
  ];

  protected static requiresUsername = true;

  public async run(): Promise<any> { // tslint:disable-line:no-any
    await this.startArticleMigration();
  }

  public async startArticleMigration(): Promise<any> { // tslint:disable-line:no-any
    await this.openWizard();
    if (!(await this.hasPermissions('article'))) {
      this.ux.error('Some of the permissions are missing.');
      return { outputString: 'Some of the permissions are missing.' };
    }

    await this.page.click('input[type="checkbox"'); // apex settings
    await this.page.click('.slds-wizard-footer button.slds-order_3'); // continue

    await this.typeEndpoint('https://zzz-scmtkb.desk.com'); // fill endpoint
    await this.page.click('.cStepTwo'); // unfocus and enable button
    await this.listenForOAuth(); // listen for the OAuth flow window
    await this.page.click('.cStepTwo button'); // authorize desk

    await this.page.waitFor('.cVerticalNavigationItemSelect[name="articles"]', { visible: true, timeout: 600000 });
    await this.page.click('.cVerticalNavigationItemSelect[name="articles"]');

    await this.page.waitFor('select[name="selectLayout"] option[value="Knowledge__kav-Knowledge Layout"]');
    await this.page.select('select[name="selectLayout"]', 'Knowledge__kav-Knowledge Layout');

    await this.page.waitFor('.cStepThree .cFieldMapping .slds-combobox ul > li');
    const comboboxes = await this.page.$$('.cStepThree .cFieldMapping .slds-combobox');

    for (let combobox of comboboxes) {
      const fieldHandle = await this.page.evaluateHandle(el => el.value, await combobox.$('input'));
      if (await fieldHandle.jsonValue() === '') {
        await combobox.click();
        (await combobox.$('.slds-listbox > li')).click();
      }
    }

    await this.page.click('.cVerticalNavigationItemSelect[name="translations"]');
    await this.page.click('.slds-wizard-footer button.slds-order_3'); // continue

    await this.page.waitFor('.cStepThree .slds-modal .slds-button_brand', { visible: true });
    await this.page.click('.cStepThree .slds-modal .slds-button_brand');
    await this.page.waitFor('.cStepFour .slds-scrollable .slds-box lightning-formatted-text', { visible: true });
  }

  public async openWizard(): Promise<any> { // tslint:disable-line:no-any
    await this.page.waitForNavigation({ waitUntil: 'domcontentloaded' });
    await this.page.click('button.salesforceIdentityAppLauncherHeader');
    await this.page.waitFor('.appTileTitle[title="Desk Migration Wizard"]', { visible: true });
    await this.page.click('.appTileTitle[title="Desk Migration Wizard"]');
  }

  public async listenForOAuth(): Promise<any> {
    const browser = this.browser;

    return browser.on('targetcreated', async () => {
      const pageList = await browser.pages();
      const newPage = await pageList[pageList.length - 1];

      await newPage.waitFor('#user_session_email');
      await newPage.type('#user_session_email', 'tstachl@salesforce.com');
      await newPage.type('#user_session_password', 'Salesforce1');
      await newPage.click('#user_session_submit');

      await newPage.waitFor('input[name="commit"]');
      await newPage.click('input[name="commit"]');
    });
  }

  public async hasPermissions(type: string): Promise<any> {
    await this.page.waitFor('.typeButton');
    const buttons = await this.page.$$('.typeButton');

    if (type === 'article') {
      buttons[0].click();
    } else {
      buttons[1].click();
    }

    return this.page.$$eval('.cStepOne ul li .cPermission', perms => {
      return perms.every((perm) => perm.classList.contains('slds-icon-utility-success'));
    });
  }

  public async typeEndpoint(endpoint: string): Promise<any> {
    await this.page.waitFor('.cStepTwo input[type=url]', { visible: true });
    const textField = await this.page.$('.cStepTwo input[type=url]');
    await textField.click();
    await textField.focus();
    await textField.click({ clickCount: 3 });
    await textField.press('Backspace');
    await textField.type(endpoint, { delay: 5 });
  }
}
