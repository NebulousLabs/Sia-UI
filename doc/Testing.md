# Testing

Testing Sia-UI is fairly immature and needs many more tests written to aide
development.

## Technologies
The testing environment has a lot of node modules that aren't used elsewhere in
the app. The open source community really shines here in that the testing
environment for our app, though using a somewhat obscure framework like
electron, has a lot of node packages that cater to its testing needs.

### [WebDriverIO](http://webdriver.io/)
The primary technology used for testing is since it seems to have [some level
of
support](https://github.com/atom/electron/blob/master/docs/tutorial/using-selenium-and-webdriver.md#setting-up-with-webdriverio)
for an electron framework. It is a module of node.js bindings for the older
Selenium WebDriver.

#### [spectron](https://github.com/kevinsawicki/spectron)
You'll notice WebDriverIO isn't actually a devDependency in the `package.json`,
that's because there's a lot of heavy lifting to make WebDriverIO cooperate
with electron that is already done in this package. This module is super
useful and a great source of examples for testing and working with Javascript
Promises in general.

### [Mocha](https://mochajs.org/)
This is a popular choice for running series of tests within a node environment. 

#### [Electron-mocha](https://github.com/jprichardson/electron-mocha)
This module enables electron modules to be `require()`ed in js test files ran
by mocha.

### [Chai](http://chaijs.com/)
This module allows for clean testing syntax in the form of
behavior-driven-development [(BDD)](http://chaijs.com/api/bdd/).

#### [Chai As Promised](https://github.com/domenic/chai-as-promised)
This builds off of Chai and "pairs really nicely with" WebDriverIO as detailed
in [spectron's
README](https://github.com/kevinsawicki/spectron#with-chai-as-promised)




