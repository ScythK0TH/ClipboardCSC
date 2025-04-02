require("chromedriver");

// import this classes from selenium
const { Builder, By, Key, until } = require("selenium-webdriver");

var assert = require("assert");

// describe test
describe("UI Test", function () {
  it("Check if the clipboard output matches the input sent by the user", async function () {
    // open chrome browser
    let driver = await new Builder().forBrowser("chrome").build();
    try {
      // navigate to to this website
      await driver.get("http://localhost:3000/");

      // Wait for the page to load
      await driver.wait(until.elementLocated(By.name("clipboard")), 1000);

      await driver.findElement(By.name("clipboard"));

      // type 'reflect run' in the search box then press ENTER Key
      let clipboardElement = await driver.wait(until.elementIsVisible(driver.findElement(By.name("clipboard"))), 1000);
      await clipboardElement.sendKeys("Srinakharinwirot University", Key.RETURN);

      let clipboardText = await driver.wait(until.elementIsVisible(driver.findElement(By.id("idofclip"))), 2000).getText();
      let idNumber = clipboardText.replace("ID: ", "");
      // console.log("ID Number:", idNumber);

      await driver.findElement(By.name("retrieveID")).sendKeys(idNumber, Key.RETURN);

      // Wait for the clipboard output to load
      await driver.wait(until.elementLocated(By.id("outputcode")), 1000);

      let output = await driver.wait(until.elementIsVisible(driver.findElement(By.id("outputcode"))),1000).getText();

      assert.strictEqual(output, "Srinakharinwirot University");

    } finally {
      await driver.quit();
    }
  },10000);

  it("Check if the login is functional and if the username matches the one the user is logging in with", async function () {
    // open chrome browser
    let driver = await new Builder().forBrowser("chrome").build();
    try {
      // navigate to to this website
      await driver.get("http://localhost:3000/");

      // Wait for the page to load
      await driver.wait(until.elementLocated(By.id("authButton")), 1000);

      await await driver.wait(until.elementIsVisible(driver.findElement(By.id("authButton")))).click();

      // type 'reflect run' in the search box then press ENTER Key
      let username = await driver.wait(until.elementIsVisible(driver.findElement(By.id("username-field"))), 1000);
      await username.sendKeys("Test1234");

      let password = await driver.wait(until.elementIsVisible(driver.findElement(By.id("password-field"))), 1000);
      await password.sendKeys("Test1234");

      await driver.findElement(By.css('div#login-button button[type="submit"]')).click();
      // console.log("ID Number:", idNumber);

      await driver.wait(until.elementLocated(By.id("usertitle")), 1000);
      let user = (await driver.wait(until.elementIsVisible(driver.findElement(By.id("usertitle"))), 1000).getText()).replace("!!", "").toLowerCase();

      assert.strictEqual(user, "test1234");

    } finally {
      await driver.quit();
    }
  },10000);

  it("Check if the clipboard after user login is stored inside the user's clipboard storage", async function () {
    // open chrome browser
    let driver = await new Builder().forBrowser("chrome").build();
    try {
      // navigate to to this website
      await driver.get("http://localhost:3000/");

      // Wait for the page to load
      await driver.wait(until.elementLocated(By.id("authButton")), 1000);

      await await driver.wait(until.elementIsVisible(driver.findElement(By.id("authButton")))).click();

      // type 'reflect run' in the search box then press ENTER Key
      let username = await driver.wait(until.elementIsVisible(driver.findElement(By.id("username-field"))), 1000);
      await username.sendKeys("Test1234");

      let password = await driver.wait(until.elementIsVisible(driver.findElement(By.id("password-field"))), 1000);
      await password.sendKeys("Test1234");

      await driver.findElement(By.css('div#login-button button[type="submit"]')).click();
      // console.log("ID Number:", idNumber);

      // Wait for the page to load
      await driver.wait(until.elementLocated(By.name("clipboard")), 1000);

      await driver.findElement(By.name("clipboard"));

      // type 'reflect run' in the search box then press ENTER Key
      let clipboardElement = await driver.wait(until.elementIsVisible(driver.findElement(By.name("clipboard"))), 1000);
      await clipboardElement.sendKeys("Srinakharinwirot University", Key.RETURN);
      
      let clipboardText = await driver.wait(until.elementIsVisible(driver.findElement(By.id("idofclip"))), 2000).getText();
      let idNumber = clipboardText.replace("ID: ", "");

      await driver.wait(until.elementLocated(By.css(`[data-id="${idNumber}"]`)), 2000).click();

      // Wait for the clipboard output to load
      await driver.wait(until.elementLocated(By.id("outputcode")), 1000);

      let output = await driver.wait(until.elementIsVisible(driver.findElement(By.id("outputcode"))),1000).getText();

      assert.strictEqual(output, "Srinakharinwirot University");
    } finally {
      await driver.quit();
    }
  },10000);
}
)
