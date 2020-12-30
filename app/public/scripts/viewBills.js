'use strict'

fetch('/api/myBills')
  .then((response) => {
    if (response.ok) return response.json()
    else throw 'Failed to load bills from database'
  })
  .then((data) => {
    if (data.length > 0) {
      // Add card for each bill
      data.forEach(element => {
        // View bills as cards
        const cardDeck = document.getElementById('cardDeck')
        // Create the card
        const card = document.createElement('div')
        card.classList.add('card')
        card.classList.add('mb-4')
        card.classList.add('shadow-sm')

        // Create card header
        const cardHeader = document.createElement('div')
        cardHeader.classList.add('card-header')

        const head = document.createElement('h4')
        head.classList.add('my-0')
        head.classList.add('font-weight-normal')
        const strongText = document.createElement('strong')
        strongText.innerHTML = element.billType
        head.appendChild(strongText)

        // Create card body
        const cardBody = document.createElement('div')
        cardBody.classList.add('card-body')

        const cardTitle = document.createElement('h1')
        cardTitle.classList.add('card-title')
        cardTitle.classList.add('pricing-card-title')
        const smallText = document.createElement('small')
        smallText.classList.add('text-muted')
        smallText.innerHTML = ' / member'
        cardTitle.innerHTML = `R${element.splitShare}`
        cardTitle.appendChild(smallText)

        const cardList = document.createElement('ul')
        cardList.classList.add('list-unstyled')
        cardList.classList.add('mt-3')
        cardList.classList.add('mb-4')

        const listItem1 = document.createElement('li')
        listItem1.innerHTML = `R${element.amount} Total Amount`
        cardList.appendChild(listItem1)
        const listItem2 = document.createElement('li')
        listItem2.innerHTML = `${element.numberOfMembers} members`
        cardList.appendChild(listItem2)

        // Append card header and body to card, the append card to card deck
        cardBody.appendChild(cardTitle)
        cardBody.appendChild(cardList)
        cardHeader.appendChild(head)
        card.appendChild(cardHeader)
        card.appendChild(cardBody)
        cardDeck.appendChild(card)
      })
    } else {
      // Display message if there are no bills
      const messageSection = document.createElement('div')
      const text = document.createElement('p')
      text.innerHTML = 'Your saved bills will appers here...'
      document.body.appendChild(messageSection.appendChild(text))
    }
  })
  .catch((e) => { alert(e) })
