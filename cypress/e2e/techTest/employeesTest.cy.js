///<reference types="cypress" />

describe('Validate cities on table', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080/employees.html')
  })
  it('Page loads properly', () => {
    cy.contains('Login')
    cy.get('#treeGrid').should('exist')
    cy.get('#form').should('be.visible')

  })

  it('Cities are displayed on the grid', () => {
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
    cy.clickViewSelectedData()

    cy.get('#listBoxContentlistBoxSelected')
      .should('be.empty')
  })

  it('Select all employees', () => {
    cy.expandTreeButton('Steven')

    let selectedEmployees = [];

    cy.get('#treeGrid')
      .find('.jqx-tree-grid-checkbox')
      .each(($checkbox, index) => {
        cy.get('#treeGrid')
          .find('.jqx-tree-grid-checkbox')
          .eq(index)
          .click()

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

    cy.clickViewSelectedData()

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

    cy.selectRowsWithCity('')

    cy.clickViewSelectedData()

    cy.get('#listBoxContentlistBoxSelected')
      .should('contain', null)
  })

  it('Multiple checks', () => {

    let cityNames = []

    cy.get('#treeGrid')
      .find('tr') 
      .eq(1) 
      .find('td') 
      .eq(3) 
      .invoke('text') 
      .then((cityText) => {
        cityNames.push(cityText.trim())
      })

    cy.checkRow(1)
    cy.clickViewSelectedData()


    cy.get('#listBoxSelected') 
      .find('.jqx-listitem-state-normal') 
      .each(($li, index) => {
        const listItemText = $li.text()

        expect(listItemText).to.include(cityNames[index]);
      })

    cy.get('#treeGrid')
      .find('tr')
      .eq(0) 
      .find('td')
      .eq(3) 
      .invoke('text')
      .then((cityText) => {
        cityNames.push(cityText.trim())
      })

    cy.checkRow(0)

    cy.clickViewSelectedData()

    cy.get('#listBoxSelected') 
      .find('.jqx-listitem-state-normal') 
      .each(($li, index) => {
        const listItemText = $li.text()
        
        let foundCity = false;
        cityNames.forEach((city) => {
          if (listItemText.includes(city)) {
            foundCity = true
          }
        })
        expect(foundCity).to.be.true
      })
  })
})
