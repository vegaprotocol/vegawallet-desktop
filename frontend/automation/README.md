# End-to-end test for Vegawallet

## Set up

Install dependencies:

```sh
npm install
```

Ensure also you have localhost running before starting tests if you are running against a localhost environment

Run the tests through CLI:

Open Cypress

```
npm run cypress:open
```

Run Cypress tests from CLI

```
"test:local": "CYPRESS_ENV=localhost npm run test",

"test:prod": "CYPRESS_ENV=production npm run test",

"test": "cypress run --env TAGS='@e2e-test' --spec 'cypress/integration/**/*.feature'"
```

If you pass in the `CYPRESS_ENV` it will run the tests with the corresponding config file in your config folder.

### Environment configs

By default , When cypress is opened locally it will use the cypress.json file . However, if we want to run these tests on other environments or on CI we need to create specific configs for the environments

in cypress > Config

You can find a list of config files here , or you can create a new one . Always ensure that you add this correctly to the command `CYPRESS_ENV` when running tests

## Folder structure

- Feature File: `Cypress > Integration > .feature` at the root of integration folder
- Steps: `Cypress > Support > step_definitions`
- Page Objects: `cypress > support > pages`

NOTE: The way that the cucumber-preprocessor package resolves the path between feature and step is that you must create a folder that shares the same name as the feature , within that folder you put in your steps

**Example:**

`workspace.feature = workspace folder > x.steps.js`

### Page-Objects

Page objects are located in the
`cypress > support > pages > x.page.js`

examples

```js
// Selectors
workspaceTabItem() {
  return cy.get('[data-testid="workspace-item"]')
}
```

```js
// Functions
visit() {
  cy.visit('/');
  cy.url().should('include','trading')
}
```
