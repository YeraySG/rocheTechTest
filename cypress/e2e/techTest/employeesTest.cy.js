///<reference types="cypress" />

describe('Validate cities on table', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080/employees.html')
  })
  it ('Page loads properly', () => {
    cy.contains('Login')
    cy.get('#treeGrid').should('exist')
    cy.get('#form').should('be.visible')

  })
  
  it('Cities are displayed on the grid', () =>{
    const expectedCities = ['Tacoma', 'Seattle', 'Kirkland', 'Redmond', 'London', '']
    
    cy.expandTreeButton('Steven')

    cy.get('#jqxScrollThumbhorizontalScrollBartreeGrid') 
      .trigger('mousedown', { which: 1 })  
      .trigger('mousemove', { clientX: 600, clientY: 0 }) 
      .trigger('mouseup')

    const foundCities = new Set()

    cy.get('#treeGrid')
      .find('tr') 
      .each(($row) => {
        cy.wrap($row)
          .find('td') 
          .last() 
          .invoke('text')
          .then((cityText) => {
            foundCities.add(cityText.trim()) 
          })
      })
      .then(() => {
        expectedCities.forEach((city) => {
          expect(foundCities.has(city)).to.be.true
      })
    })
  })
})

describe('Checkbox scenarios', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080/employees.html')
  })

  it('No employees are selected', () => {
    cy.get('#btn')
      .click()

    cy.get('#listBoxContentlistBoxSelected')
      .should('be.empty') 
  })

  it ('Select all employees', () => {
    cy.expandTreeButton('Steven')

    let selectedEmployees = [];

    cy.get('#treeGrid')
      .find('.jqx-tree-grid-checkbox')
      .each(($checkbox, index) => {  
        cy.get('#treeGrid')
          .find('.jqx-tree-grid-checkbox')
          .eq(index)  
          .click()
      // .click({ multiple: true })  // This one also works but might be not as safe

        cy.get('#treeGrid')
          .find('tr')
          .eq(index)
          .within(() => {
            cy.get('td').eq(0).invoke('text').then((firstName) => {
                cy.get('td').eq(3).invoke('text').then((city) => {
                  selectedEmployees.push({ name: `${firstName}`, city });
                })
              })
            })
          })

          cy.get('#btn')
            .click()
 
    cy.get('#listBoxSelected')
      .find('.jqx-listitem-state-normal') 
      .each(($li, index) => {
        const listItemText = $li.text()
        const expectedEmployee = selectedEmployees[index]

        expect(listItemText).to.include(expectedEmployee.name) 
        expect(listItemText).to.include(expectedEmployee.city) 
      })
  })

  it('Null cities only', () => {

    cy.expandTreeButton('Steven')

    cy.get('#treeGrid')
      .find('tr') 
      .then(($rows) => {
        const emptyCityRow = $rows.toArray().find(row => {
          const cityText = Cypress.$(row).find('td').eq(3).text().trim()
          return cityText === ''
        })
      if (emptyCityRow) {
        cy.wrap(emptyCityRow)
          .find('.jqx-tree-grid-checkbox') 
          .click();
        cy.get('#btn')
          .click()
        cy.get('#listBoxContentlistBoxSelected')
          .should('contain', null) 
          }})
        })
      })
