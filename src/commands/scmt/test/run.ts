import { flags } from '@oclif/command'
import { core } from '@salesforce/command'
import CommandBase from '../../../command_base'
import { BADHINTS } from 'dns';

// Initialize Messages with the current plugin directory
core.Messages.importMessagesDirectory(__dirname);

// Load the specific messages for this file. Messages from @salesforce/command, @salesforce/core,
// or any library that is using the messages framework can also be loaded this way.
const messages = core.Messages.loadMessages('@desklabs/scmt', 'test');
// const FIELDS = ['AccountRecordsFailed__c', 'AccountRecordsMigrated__c', 'AccountRecordsTotal__c', 'ArticleRecordsFailed__c', 'ArticleRecordsMigrated__c', 'ArticleRecordsTotal__c', 'AttachmentRecordsFailed__c', 'AttachmentRecordsMigrated__c', 'AttachmentRecordsTotal__c', 'CaseRecordsFailed__c', 'CaseRecordsMigrated__c', 'CaseRecordsTotal__c', 'ContactRecordsFailed__c', 'ContactRecordsMigrated__c', 'ContactRecordsTotal__c', 'InteractionRecordsFailed__c', 'InteractionRecordsMigrated__c', 'InteractionRecordsTotal__c', 'NoteRecordsFailed__c', 'NoteRecordsMigrated__c', 'NoteRecordsTotal__c', 'TopicRecordsFailed__c', 'TopicRecordsMigrated__c', 'TopicRecordsTotal__c', 'RecordsFailed__c', 'RecordsMigrated__c', 'RecordsTotal__c', 'Config__c', 'Desk_Config_Id__c', 'Desk_Endpoint__c', 'Error__c', 'JobId__c', 'Log__c', 'Mapping__c', 'Migration_Type__c', 'Object__c', 'StartDate__c', 'Status__c'];

export default class Run extends CommandBase {
  public static description = messages.getMessage('runCommandDescription');
  public static examples = [
    `$ sfdx scmt:test:run`,
    `$ sfdx scmt:test:run --targetusername myOrg@example.com`
  ];

  protected static requiresUsername = true;
  protected static flagsConfig = {
    endpoint: flags.string({ char: 'e', description: messages.getMessage('endpointFlagDescription'), required: true }),
    username: flags.string({ char: 'n', description: messages.getMessage('usernameFlagDescription'), required: true }),
    password: flags.string({ char: 'p', description: messages.getMessage('passwordFlagDescription'), required: true }),
    migration: flags.string({ char: 'm', description: messages.getMessage('migrationFlagDescription'), default: 'article', options: ['article', 'case'] })
  };

  public async run(): Promise<any> { // tslint:disable-line:no-any
    try {
      await this.openWizard();
      await this.stepOne();
      await this.stepTwo();
      await this.stepThree();
      await this.stepFour();
    } catch(err) {
      await this.page.screenshot({ path: './error.jpg', fullPage: true });
      throw new core.SfdxError(err);
    }
  }

  public async stepFour(): Promise<void> {
    this.ux.log('SCMT:TEST:RUN - stepFour');
    await this.page.waitFor(10000);
    await this.page.waitForFunction('!document.querySelector(".slds-wizard-footer button.slds-order_3").disabled', { timeout: 900000 });
    await this.page.screenshot({ path: './complete.jpg', fullPage: true });
    await this.page.click('.slds-wizard-footer button.slds-order_3');
    await this.page.waitFor(5000);
  }

  public async stepThree(): Promise<void> {
    this.ux.log('SCMT:TEST:RUN - stepThree');

    if (this.flags.migration == 'article') {
      await this.page.waitFor('.cVerticalNavigationItemSelect[name="articles"]', { visible: true, timeout: 120000 });
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
    } else {

    }

    await this.page.click('.slds-wizard-footer button.slds-order_3'); // continue

    await this.page.waitFor('.cStepThree .slds-modal .slds-button_brand', { visible: true });
    await this.page.click('.cStepThree .slds-modal .slds-button_brand');
    await this.page.waitFor('.cStepFour .slds-scrollable .slds-box lightning-formatted-text', { visible: true });
  }

  public async stepTwo(): Promise<void> {
    this.ux.log('SCMT:TEST:RUN - stepTwo');
    await this.typeEndpoint(); // fill endpoint
    await this.page.click('.cStepTwo'); // unfocus and enable button
    await this.listenForOAuth(this.flags.username, this.flags.password); // listen for the OAuth flow window
    await this.page.click('.cStepTwo button'); // authorize desk
  }

  public async stepOne(): Promise<void> {
    this.ux.log('SCMT:TEST:RUN - stepOne');
    if (!(await this.hasPermissions(this.flags.migration))) {
      throw new core.SfdxError(messages.getMessage('errorPermissionMissing'));
    }
    await this.page.click('input[type="checkbox"'); // apex settings
    await this.page.click('.slds-wizard-footer button.slds-order_3'); // continue
  }

  public async openWizard(): Promise<any> { // tslint:disable-line:no-any
    this.ux.log('SCMT:TEST:RUN - openWizard');
    await this.page.waitForNavigation({ waitUntil: 'domcontentloaded' });
    await this.page.click('button.salesforceIdentityAppLauncherHeader');
    await this.page.waitFor('.appTileTitle[title="Desk Migration Wizard"]', { visible: true });
    await this.page.click('.appTileTitle[title="Desk Migration Wizard"]');
  }

  public async listenForOAuth(username: string, password: string): Promise<any> {
    const browser = this.browser;

    return browser.on('targetcreated', async () => {
      const pageList = await browser.pages();
      const newPage = await pageList[pageList.length - 1];

      await newPage.waitFor('#user_session_email');
      await newPage.type('#user_session_email', username);
      await newPage.type('#user_session_password', password);
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

  public async typeEndpoint(): Promise<any> {
    await this.page.waitFor('.cStepTwo input[type=url]', { visible: true });
    const textField = await this.page.$('.cStepTwo input[type=url]');
    await textField.click();
    await textField.focus();
    await textField.click({ clickCount: 3 });
    await textField.press('Backspace');
    await textField.type(this.flags.endpoint, { delay: 1 });
  }
}
