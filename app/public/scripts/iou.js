'use strict'

fetch('/api/i-o-u')
  .then((response) => {
    if (response.ok) return response.json()
    else throw 'Failed to load bills from database'
  })
  .then((data) => {
    if (data.length > 0) {
      // Create table headers as array
      const theads = ['Member Owed', 'Bill Type', 'Amount Owed', '']
      let total = 0
      // Create table to display members owed by user
      const table = document.createElement('table')
      table.classList.add('table')
      table.classList.add('table-striped')
      table.classList.add('center')
      tableHeader(theads, table)

      // Add row for each owing member
      data.forEach(element => {
        const row = table.insertRow(-1)
        addCell(row, element.payer)
        addCell(row, element.billType)
        addCell(row, `R${element.splitShare}`)
        total += element.splitShare

        const payer = document.getElementById('payer')
        const billType = document.getElementById('billType')

        const button = document.createElement('button')
        button.classList.add('btn')
        button.classList.add('btn-success')
        button.innerHTML = 'Settle'
        button.type = 'submit'
        button.onclick = () => {
          if (!document.getElementsByTagName || !document.createTextNode) return
          var rows = table.getElementsByTagName('tbody')[0].getElementsByTagName('tr')
          for (let i = 0; i < rows.length; i++) {
            rows[i].onclick = function () {
              payer.value = table.rows[this.rowIndex].cells[0].innerHTML
              billType.value = table.rows[this.rowIndex].cells[1].innerHTML
              const formo = document.getElementById('formo')
              if (confirm(`Settle ${table.rows[this.rowIndex].cells[1].innerHTML} by ${table.rows[this.rowIndex].cells[0].innerHTML}`)) {
                formo.submit()
              }
            }
          }
        }

        const rowCell = row.insertCell(-1)
        rowCell.appendChild(button)
      })

      // Display the total amount owed on the total div
      const totalSection = document.getElementById('total')
      const text = document.createElement('h2')
      text.innerHTML = `You currently owe: R${total}`
      totalSection.appendChild(text)

      // Append table to the table section
      const tableSection = document.getElementById('tableSection')
      tableSection.appendChild(table)
    } else {
      // Display message if there are no owed members
      const totalSection = document.getElementById('total')
      const text = document.createElement('h2')
      text.innerHTML = 'Members who you owe will appear here...'
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
