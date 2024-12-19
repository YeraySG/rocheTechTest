// cypress/support/commands.js

Cypress.Commands.add('expandTreeButton', (nodeName) => {
    cy.get('#treeGrid')
      .contains('Steven')
      .siblings('.jqx-tree-grid-collapse-button')
      .click()
})
