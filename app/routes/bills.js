'use strict'

// Creating a bill object with amount and share for members bill is split with
const bill = {
  amount: 0,
  number_of_members: 0,
  split_share: 0,
  type: '',
  payer: 'user1',
  members: []
}

// Calculating the share of each member for equally split bill
const calculateShare = (amount, numOfMembers) => {
  return amount / numOfMembers
}

// Setter functions for the bill object properties
const setAmount = (billAmount) => {
  bill.amount = billAmount
}
const setMemberNumber = (numOfMembers) => {
  bill.number_of_members = numOfMembers
}
const setBillType = (billType) => {
  bill.type = billType
}

module.exports = {
  // Sets the amount, number of members, type and calculates their share for the bill
  set: (billAmount, numOfMembers, billType) => {
    if (billAmount >= 0 && numOfMembers > 0 && typeof billType === 'string') {
      setAmount(billAmount)
      setMemberNumber(numOfMembers)
      setBillType(billType)
      bill.split_share = calculateShare(billAmount, numOfMembers)
    }
  },
  // Returns the bill object
  get: () => {
    return bill
  },
  // Reset bill information
  reset: () => {
    bill.amount = 0
    bill.number_of_members = 0
    bill.split_share = 0
    bill.type = ''
    bill.members.splice(0, bill.members.length)
  },
  // Adds member to the bill if not current user and not already in list
  addMember: (member) => {
    const searchMember = member.toLowerCase()
    const memberArray = []
    bill.members.forEach((element) => memberArray.push(element.toLowerCase()))

    if (member !== bill.payer && memberArray.indexOf(searchMember) < 0) {
      bill.members.push(member)
    }
  }
}
