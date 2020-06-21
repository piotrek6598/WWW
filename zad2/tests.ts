let webDriver = require('selenium-webdriver');
const {By} = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

async function try_quiz_second_time() {
    let driver = new webDriver.Builder()
        .forBrowser('chrome')
        .setChromeOptions(new chrome.Options().headless())
        .build();
    try {
        let url = 'http://localhost:3000';
        await driver.get(url);
        await driver.findElement(By.name('username')).sendKeys("user1");
        await driver.findElement(By.name('passwd')).sendKeys("user1");
        await driver.findElement(By.name('logins')).click();
        await new Promise(r => setTimeout(r, 500));
        await driver.findElement(By.name('stb1')).click();
        await driver.get(url);
        await driver.findElement(By.name('logout')).click();
        await new Promise(r => setTimeout(r, 500));
        await driver.findElement(By.name('username')).sendKeys("user1");
        await driver.findElement(By.name('passwd')).sendKeys("user1");
        await driver.findElement(By.name('logins')).click();
        await new Promise(r => setTimeout(r, 500));
        await driver.findElement(By.name('stb1')).click();
        await new Promise(r => setTimeout(r, 500));
        await driver.findElement(By.className('msgBox'));
        await driver.quit();
        console.log("Try quiz second time: PASS");
    } catch (err) {
        console.log("Try quiz second time: FAIL");
        console.error(err.message);
        await driver.quit();
    }
}

async function check_logout_after_password_change() {
    let driver = new webDriver.Builder()
        .forBrowser('chrome')
        .setChromeOptions(new chrome.Options().headless())
        .build();
    try {
        let url = 'http://localhost:3000';
        await driver.get(url);
        await driver.findElement(By.name('username')).sendKeys("user1");
        await driver.findElement(By.name('passwd')).sendKeys("user1");
        await driver.findElement(By.name('logins')).click();
        let usr = await new Promise((resolve, reject) => {
            let cookie = driver.manage().getCookie('usr');
            resolve(cookie);
        });
        let ul = await new Promise((resolve, reject) => {
            let cookie = driver.manage().getCookie('ul');
            resolve(cookie);
        });
        await new Promise(r => setTimeout(r, 500));
        await driver.manage().deleteAllCookies();
        await driver.get(url);
        await driver.findElement(By.name('username')).sendKeys("user1");
        await driver.findElement(By.name('passwd')).sendKeys("user1");
        await driver.findElement(By.name('logins')).click();
        await new Promise(r => setTimeout(r, 500));
        await driver.findElement(By.name('chgpasswd')).click();
        await new Promise(r => setTimeout(r, 500));
        await driver.findElement(By.name('cpasswd')).sendKeys("user1");
        await driver.findElement(By.name('passwd')).sendKeys("xyz");
        await driver.findElement(By.name('rpasswd')).sendKeys("xyz");
        await driver.findElement(By.name('chgs')).click();
        await new Promise(r => setTimeout(r, 500));
        await driver.manage().addCookie({name:usr['name'], value:usr['value']});
        await driver.manage().addCookie({name:ul['name'], value:ul['value']});
        await driver.get(url);
        await driver.findElement(By.name('logins'));
        await driver.quit();
        console.log("Logout after password change: PASS");
    } catch (err) {
        console.log("Logout after password change: FAIL");
        console.error(err.message);
        await driver.quit();
    }
}

async function run_test() {
    await try_quiz_second_time();
    await check_logout_after_password_change();
}

run_test();