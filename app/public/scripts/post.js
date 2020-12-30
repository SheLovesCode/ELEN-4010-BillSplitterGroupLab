'use strict'

fetch('/api/info')
  .then((response) => {
    if (response.ok) return response.json()
    else throw 'Failed to load bill information'
  })
  .then((data) => {
    // Adds bill type
    const billType = document.getElementById('billType')
    billType.innerHTML = `${data.type}`

    // Adds number of members
    const numberOfMembers = document.getElementById('numberOfMembers')
    numberOfMembers.innerHTML = `${data.number_of_members}`

    // Adds total amount
    const totalAmount = document.getElementById('totalAmount')
    totalAmount.innerHTML = `R${data.amount}`

    // Adds individual share amount
    const individualShare = document.getElementById('individualShare')
    individualShare.innerHTML = `R${data.split_share}`

    // Adds list of members
    const memberList = document.getElementById('memberList')
    memberList.innerHTML = `${data.members}`
  })
  .catch((e) => {
    alert(e)
  })
