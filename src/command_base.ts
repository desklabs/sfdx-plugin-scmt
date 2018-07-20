import * as Config from '@oclif/config';
import { SfdxCommand } from '@salesforce/command';
import { launch, Browser, Page } from 'puppeteer';
import { existsSync, mkdirSync } from 'fs';

export default abstract class CommandBase extends SfdxCommand {
  protected browser: Browser;
  protected page: Page;

  protected static TEST_OUTPUT: string = './output';

  protected async assignOrg(): Promise<void> {
    await super.assignOrg();
    await this.org.refreshAuth();

    let debug = (this.logger.getLevel() <= 20);

    this.browser = await launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox", '--window-size=1920,1195'],
      headless: !debug,
      slowMo: debug ? 250 : 0
    });

    this.page = await this.browser.newPage();
    if (debug) this.page.on('console', console.log)

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

  protected async screenshot(name: string): Promise<void> {
    if (!existsSync(CommandBase.TEST_OUTPUT)){
      mkdirSync(CommandBase.TEST_OUTPUT);
    }

    const path = `${CommandBase.TEST_OUTPUT}/${name}-${Date.now()}.jpg`;
    await this.page.screenshot({ path: path, fullPage: true });
  }
}
