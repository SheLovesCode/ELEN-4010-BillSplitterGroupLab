'use strict'

fetch('/api/u-o-me')
  .then((response) => {
    if (response.ok) return response.json()
    else throw 'Failed to load bills from database'
  })
  .then((data) => {
    if (data.length > 0) {
      // Create table headers as array
      const theads = ['Member', 'Bill Type', 'Amount Owed']
      let total = 0

      // Create table to display owing members
      const table = document.createElement('table')
      table.classList.add('table')
      table.classList.add('table-striped')
      table.classList.add('center')
      tableHeader(theads, table)

      // Add row for each owing member
      data.forEach(element => {
        const row = table.insertRow(-1)
        addCell(row, element.member)
        addCell(row, element.billType)
        addCell(row, `R${element.splitShare}`)
        total += element.splitShare
      })

      // Display the total amount owed on the total div
      const totalSection = document.getElementById('total')
      const text = document.createElement('h2')
      text.innerHTML = `You are currently owed: R${total}`
      totalSection.appendChild(text)

      // Append table to the table section
      const tableSection = document.getElementById('tableSection')
      tableSection.appendChild(table)
    } else {
      // Display message if there are no owing members
      const totalSection = document.getElementById('total')
      const text = document.createElement('h2')
      text.innerHTML = 'Members who owe you will appear here...'
      totalSection.appendChild(text)
    }
  })
  .catch((e) => { alert(e) })

// Add cell to a table row
const addCell = (row, cellData) => {
  const rowCell = row.insertCell(-1)
  rowCell.innerHTML = cellData
}

// Adds headers to a table as array
const tableHeader = (theads, table) => {
  const row = table.insertRow(-1)
  for (let i = 0; i < theads.length; i++) {
    const tdata = document.createElement('th')
    tdata.innerHTML = theads[i]
    row.appendChild(tdata)
  }
}
