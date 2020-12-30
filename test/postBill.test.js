/* eslint-env jest */

const bill = require('../app/routes/bills')

// Tests related to posting of bill functionality
describe('Posting bill', () => {
  test('Bill object properties can be set', () => {
    // Input to be used for testing
    const input = {
      amount_: 100,
      members_: 5,
      type_: 'Groceries'
    }

    bill.set(input.amount_, input.members_, input.type_)

    // Checking if bill amount is set
    expect(bill.get().amount).toBe(input.amount_)
    // Checking if number of members is set
    expect(bill.get().number_of_members).toBe(input.members_)
    // Checking if bill type is set
    expect(bill.get().type).toBe(input.type_)
  })

  test('Share of bill is calculated', () => {
    // Input to be used for testing
    const input = {
      amount_: 100,
      members_: 5,
      type_: 'Groceries'
    }

    bill.set(input.amount_, input.members_, input.type_)

    // Checking if the share is calculated
    expect(bill.get().split_share).toEqual(input.amount_ / input.members_)
  })

  test('Invalid input amount not set', () => {
    // Input to be used for testing invalid amount
    const input = {
      amount_: -100,
      members_: 5,
      type_: 'Groceries'
    }

    bill.set(input.amount_, input.members_, input.type_)

    // Checking that invalid input is not set
    expect(bill.get()).not.toEqual(input)
  })

  test('Invalid input member number not set', () => {
    // Input to be used for testing invalid member number
    const input = {
      amount_: 100,
      members_: 0,
      type_: 'Groceries'
    }

    bill.set(input.amount_, input.members_, input.type_)

    // Checking that invalid input is not set
    expect(bill.get()).not.toEqual(input)
  })

  test('Invalid input bill type not set', () => {
    // Input to be used for testing invalid bill type
    const input = {
      amount_: 100,
      members_: 5,
      type_: 5
    }

    bill.set(input.amount_, input.members_, input.type_)

    // Checking that invalid input is not set
    expect(bill.get()).not.toEqual(input)
  })
})
