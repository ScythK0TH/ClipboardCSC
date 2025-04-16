require("chromedriver");

// import this classes from selenium
const { Builder, By, Key, until } = require("selenium-webdriver");

var assert = require("assert");

// describe test
describe("UI Test", function () {
  it("Check if the clipboard output matches the input sent by the user", async function () {
    // open MicrosoftEdge browser
    let driver = await new Builder().forBrowser("MicrosoftEdge").build();
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
    // open MicrosoftEdge browser
    let driver = await new Builder().forBrowser("MicrosoftEdge").build();
    try {
      // navigate to to this website
      await driver.get("http://localhost:3000/");

      // Wait for the page to load
      await driver.wait(until.elementLocated(By.id("authButton")), 1000);

      await driver.wait(until.elementIsVisible(driver.findElement(By.id("authButton")))).click();

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
    // open MicrosoftEdge browser
    let driver = await new Builder().forBrowser("MicrosoftEdge").build();
    try {
      // navigate to to this website
      await driver.get("http://localhost:3000/");

      // Wait for the page to load
      await driver.wait(until.elementLocated(By.id("authButton")), 1000);

      await driver.wait(until.elementIsVisible(driver.findElement(By.id("authButton")))).click();

      // type 'reflect run' in the search box then press ENTER Key
      let username = await driver.wait(until.elementIsVisible(driver.findElement(By.id("username-field"))), 1000);
      await username.sendKeys("Test1234");

      let password = await driver.wait(until.elementIsVisible(driver.findElement(By.id("password-field"))), 1000);
      await password.sendKeys("Test1234");

      await driver.findElement(By.css('div#login-button button[type="submit"]')).click();
      // console.log("ID Number:", idNumber);

      // Add a delay for 500 milliseconds
      await new Promise(resolve => setTimeout(resolve, 500));

      // type 'reflect run' in the search box then press ENTER Key
      let clipboardElement = await driver.wait(until.elementIsVisible(driver.findElement(By.name("clipboard"))), 1000);
      await clipboardElement.sendKeys("Srinakharinwirot University", Key.RETURN);
      
      // Add a delay for 500 milliseconds
      await new Promise(resolve => setTimeout(resolve, 500));

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

  it("Check if the registration process works correctly", async function () {
    // open MicrosoftEdge browser
    let driver = await new Builder().forBrowser("MicrosoftEdge").build();
    try {
      // navigate to website
      await driver.get("http://localhost:3000/");

      // Wait for auth button and click it
      await driver.wait(until.elementLocated(By.id("authButton")), 1000);
      await driver.wait(until.elementIsVisible(driver.findElement(By.id("authButton")))).click();

      // Click register button
      let registerButton = await driver.wait(until.elementIsVisible(driver.findElement(By.id("registerToButton"))), 1000);
      await registerButton.click();

      // Fill in registration form
      let username = await driver.wait(until.elementIsVisible(driver.findElement(By.id("rusername-field"))), 1000);
      await username.sendKeys("TestUser123");

      let password = await driver.wait(until.elementIsVisible(driver.findElement(By.id("rpassword-field"))), 1000);
      await password.sendKeys("TestPass123");

      let confirmPassword = await driver.wait(until.elementIsVisible(driver.findElement(By.id("rcpassword-field"))), 1000);
      await confirmPassword.sendKeys("TestPass123");

      // Submit registration form
      await driver.findElement(By.css('div#login-button button[type="submit"]')).click();

      // Add a delay for 500 milliseconds
      await new Promise(resolve => setTimeout(resolve, 500));

      // Check if redirected to login page
      await driver.wait(until.elementLocated(By.id("login-title")), 1000);
      let loginTitle = await driver.findElement(By.id("login-title")).getText();
      
      assert.strictEqual(loginTitle, "LOGIN");

    } finally {
      await driver.quit();
    }
  },10000);

  it("Check if editing clipboard content works correctly", async function () {
    let driver = await new Builder().forBrowser("MicrosoftEdge").build();
    try {
      await driver.get("http://localhost:3000/");
      
      // Login first
      await driver.wait(until.elementLocated(By.id("authButton")), 1000);
      await driver.wait(until.elementIsVisible(driver.findElement(By.id("authButton")))).click();
      
      let username = await driver.wait(until.elementIsVisible(driver.findElement(By.id("username-field"))), 1000);
      await username.sendKeys("Test1234");
      
      let password = await driver.findElement(By.id("password-field"));
      await password.sendKeys("Test1234");
      
      await driver.findElement(By.css('div#login-button button[type="submit"]')).click();

      // Add a delay for 1000 milliseconds
      await new Promise(resolve => setTimeout(resolve, 500));

      // Create new clipboard
      let clipboardElement = await driver.wait(until.elementIsVisible(driver.findElement(By.name("clipboard"))), 1000);
      await clipboardElement.sendKeys("Original Text", Key.RETURN);

      // Add a delay for 1000 milliseconds
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      let clipboardText = await driver.wait(until.elementIsVisible(driver.findElement(By.id("idofclip"))), 2000).getText();
      let idNumber = clipboardText.replace("ID: ", "");

      // Click on the clipboard to edit
      await driver.wait(until.elementLocated(By.css(`[data-id="${idNumber}"]`)), 2000).click();

      // Add a delay for 1000 milliseconds
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Edit the clipboard content
      let outputElement = await driver.wait(until.elementIsVisible(driver.findElement(By.id("outputcode"))), 2000);
      await outputElement.clear();
      await outputElement.sendKeys("Edited Text");

      await new Promise(resolve => setTimeout(resolve, 500));

      // Save the changes
      await driver.wait(until.elementIsVisible(driver.findElement(By.id("editButton"))), 1000).click();

      // Add a delay for 1000 milliseconds
      await new Promise(resolve => setTimeout(resolve, 1000));

      await driver.wait(until.elementIsVisible(driver.findElement(By.id("backButton"))), 1000).click();

      // Add a delay for 1000 milliseconds
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Verify the edit
      await driver.wait(until.elementLocated(By.css(`[data-id="${idNumber}"]`)), 2000).click();
      let editedOutput = await driver.wait(until.elementIsVisible(driver.findElement(By.id("outputcode"))), 2000).getText();
      
      // Add a delay for 500 milliseconds
      await new Promise(resolve => setTimeout(resolve, 500));

      assert.strictEqual(editedOutput, "Edited Text");

    } finally {
      await driver.quit();
    }
  }, 10000);

  it("Check if deleting clipboard works correctly", async function () {
    let driver = await new Builder().forBrowser("MicrosoftEdge").build();
    try {
      await driver.get("http://localhost:3000/");
      
      // Login first
      await driver.wait(until.elementLocated(By.id("authButton")), 1000);
      await driver.wait(until.elementIsVisible(driver.findElement(By.id("authButton")))).click();
      
      let username = await driver.wait(until.elementIsVisible(driver.findElement(By.id("username-field"))), 1000);
      await username.sendKeys("Test1234");
      
      let password = await driver.findElement(By.id("password-field"));
      await password.sendKeys("Test1234");
      
      await driver.findElement(By.css('div#login-button button[type="submit"]')).click();

      // Add a delay for 1000 milliseconds
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Create new clipboard to delete
      let clipboardElement = await driver.wait(until.elementIsVisible(driver.findElement(By.name("clipboard"))), 1000);
      await clipboardElement.sendKeys("Text to delete", Key.RETURN);

      // Add a delay for 1000 milliseconds
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      let clipboardText = await driver.wait(until.elementIsVisible(driver.findElement(By.id("idofclip"))), 2000).getText();
      let idNumber = clipboardText.replace("ID: ", "");

      // Select the checkbox for the clipboard
      await driver.wait(until.elementLocated(By.css(`input[value="${idNumber}"]`)), 2000).click();

      // Click delete button
      await driver.findElement(By.css('div#back-container button[type="submit"]')).click();

      // Add a delay for 1000 milliseconds
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Try to retrieve the deleted clipboard (should fail or show empty)
      await driver.findElement(By.name("retrieveID")).sendKeys(idNumber, Key.RETURN);
      
      // Add a delay for 500 milliseconds
      await new Promise(resolve => setTimeout(resolve, 500));

      // Wait for error message
      let errorMessage = await driver.wait(
        until.elementLocated(By.css('.cliperror')), 
        1000
      ).getText();
      
      assert.strictEqual(errorMessage, "NO CLIPBOARD FOUND!!");

    } finally {
      await driver.quit();
    }
  }, 10000);
});
