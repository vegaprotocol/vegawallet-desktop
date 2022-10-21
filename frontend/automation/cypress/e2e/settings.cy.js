const { unlockWallet } = require('../support/helpers')

describe('settings', () => {
  const homeSettingsBtn = 'home-settings'
  const settingsForm = 'settings-form'
  const cancelSettingsBtn = 'cancel-settings'

  before(() => {
    cy.clean()
    cy.backend()
      .then(handler => {
        cy.setVegaHome(handler)
      })
      .then(() => {
        cy.waitForHome()
      })
  })

  it('dialog opens and can be closed', () => {
    cy.getByTestId(homeSettingsBtn).click()
    cy.getByTestId(settingsForm).should('be.visible')
    cy.getByTestId(cancelSettingsBtn).click()
    cy.getByTestId(settingsForm).should('not.exist')
  })

  it('saves and reloads', () => {
    cy.getByTestId(homeSettingsBtn).click()
    cy.getByTestId(settingsForm).should('be.visible')

    // assert and change log level
    cy.getByTestId('log-level').last().should('have.value', 'info').select('debug')

    // change telemetry
    const radioGroupSelector = '[role="radiogroup"]'
    cy.get(radioGroupSelector).find('input[value="no"]').should('be.checked')
    cy.get(radioGroupSelector).find('button[value="yes"]').click()

    // submit
    cy.getByTestId('update-settings').click()

    // page should reload and settings form should now not show
    cy.getByTestId(settingsForm).should('not.exist')

    cy.getByTestId(homeSettingsBtn).click()
    cy.getByTestId('log-level').last().should('have.value', 'debug')
    cy.get(radioGroupSelector).find('input[value="yes"]').should('be.checked')
    cy.getByTestId(cancelSettingsBtn).click()
  })
})
