import * as Config from '@oclif/config';
import { SfdxCommand } from '@salesforce/command';
import { launch, Browser, Page } from 'puppeteer';

export enum PropertyType {
  TEXT = "text",
  TEXTAREA = "textarea",
  CHECKBOX = "checkbox",
  BUTTON = "button",
}

export default abstract class CommandBase extends SfdxCommand {
  protected browser: Browser;
  protected page: Page;


  protected async assignOrg(): Promise<void> {
    await super.assignOrg();
    await this.org.refreshAuth();

    let debug = (this.logger.getLevel() <= 20);

    this.browser = await launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      headless: !debug,
      slowMo: debug ? 1000 : 0
    });

    this.page = await this.browser.newPage();
    await this.page.setViewport({ width: 1920, height: 1080 });
    await this.page.goto(this.buildUrl(`/secur/frontdoor.jsp?sid=${this.org.getConnection().accessToken}`));
    await this.page.waitForNavigation();
  }

  protected async finally(err: Error | undefined): Promise<void> {
    if (this.browser) await this.browser.close();
    return super.finally(err);
  }

  protected buildUrl(path: string): string {
    this.logger.debug(`CommandBase.buildUrl('${path}')`);
    return `${this.org.getConnection().instanceUrl}${path}`;
  }
}
