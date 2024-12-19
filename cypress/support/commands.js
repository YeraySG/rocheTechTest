// cypress/support/commands.js

Cypress.Commands.add('expandTreeButton', (nodeName) => {
    cy.get('#treeGrid')
      .contains('Steven')
      .siblings('.jqx-tree-grid-collapse-button')
      .click()
})

Cypress.Commands.add('selectRowsWithCity', (cityValue) => {
    cy.get('#treeGrid')
      .find('tr')  
      .then(($rows) => {
        const rowToSelect = $rows.toArray().find(row => {
            const cityText = Cypress.$(row).find('td').eq(3).text().trim()
            
            return cityText === cityValue
        })
        if (rowToSelect) {
            cy.wrap(rowToSelect)
              .find('.jqx-tree-grid-checkbox') 
              .click()
            }
          })
      })


Cypress.Commands.add('clickViewSelectedData', () => {  
    cy.get('#btn')
      .click() 
    })    

Cypress.Commands.add('checkRow', (row) => { 
    cy.get('#treeGrid')
        .find('tr')
        .eq(row)
        .find('.jqx-tree-grid-checkbox') 
        .click() 
    }) 
    