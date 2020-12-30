const express = require('express')
const mainRouter = express.Router()
const bills = require('./bills.js')
const householdList = require('../models/householdList')
const bcrypt = require('bcrypt')
const User = require('../models/database')
const database = require('./databaseInterface.js')

mainRouter.get('/', function (req, res) {
  res.sendFile('home.html', { root: req.app.get('views') })
})

mainRouter.get('/index', function (req, res) {
  res.sendFile('index.html', { root: req.app.get('views') })
})

// Getting the post bill page
mainRouter.get('/post', (req, res) => {
  res.sendFile('post.html', { root: req.app.get('views') })
})

// Getting the view bills page
mainRouter.get('/viewBills', (req, res) => {
  res.sendFile('viewBills.html', { root: req.app.get('views') })
})

// Getting the uome page for viewing owing members
mainRouter.get('/uome', (req, res) => {
  res.sendFile('uome.html', { root: req.app.get('views') })
})

// Getting the iou page for viewing members owed by user
mainRouter.get('/iou', (req, res) => {
  res.sendFile('iou.html', { root: req.app.get('views') })
})

// Router for bill posting form
mainRouter.post('/api/post', (req, res) => {
  bills.set(req.body.bill_amount, req.body.split_number, req.body.bill_type)
  res.redirect(req.baseUrl + '/post')
})

// Router for saving bill
mainRouter.post('/api/saveBill', (req, res) => {
  // Save the posted bill if it is not empty
  if (bills.get().amount <= 0 && bills.get().number_of_members <= 0 && bills.get().type === '') {
    res.redirect(req.baseUrl + '/post')
  }
  database.saveBill(bills.get().payer, bills.get().amount, bills.get().number_of_members, bills.get().type, bills.get().split_share)

  // Add each member to the BillMembers table in the database
  bills.get().members.forEach((index) => {
    database.saveMember(bills.get().payer, index, bills.get().type)
  })

  bills.reset()
  res.redirect(req.baseUrl + '/viewBills')
})

// Adding members to posted bill
mainRouter.post('/api/addMembers', (req, res) => {
  bills.addMember(req.body.member)

  // Use the members array for number of members to split with and update bill information
  if (bills.get().members.length > 0) {
    bills.set(bills.get().amount, bills.get().members.length + 1, bills.get().type)
  }
  console.log(bills.get())
  res.redirect(req.baseUrl + '/post')
})

// Reset bill information
mainRouter.post('/api/cancelBill', (req, res) => {
  bills.reset()
  res.redirect(req.baseUrl + '/post')
})

mainRouter.get('/api/info', (req, res) => {
  res.json(bills.get())
})

// Settling bill form post
mainRouter.post('/api/settleBill', (req, res) => {
  database.settleBill(req.body.payer, bills.get().payer, req.body.billType)
  res.redirect(req.baseUrl + '/iou')
})

/// //Sign in and Sign Up routes ///////////////////////

mainRouter.get('/api/signIn', (req, res) => {
  res.sendFile('index.html', { root: req.app.get('views') })
})

mainRouter.get('/api/signUp', (req, res) => {
  res.sendFile('signUp.html', { root: req.app.get('views') })
})

/**
 * @brief Save a user to a database
 *
 * The user is only saved if the username and email address are not
 * used by another user on the app
 */
mainRouter.post('/api/signUp', (req, res) => {
  const saltRounds = 10
  User.find({ username: req.body.username }, async (err, user) => {
    if (err) {
      const hash = await bcrypt.hash(req.body.password, saltRounds)
      const user = new User({
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        emailAddress: req.body.emailAddress,
        passwordHash: hash
      })

      user.save((err, user) => {
        if (err) {
          console.log('User not saved to database: \n', err)
          res.status(400).send('Failed to create account')
        } else {
          console.log('saved user to database: \n', user)
          res.sendFile('index.html', { root: req.app.get('views') }) // Login page
        }
      })
    } else { res.status(400).send('Username already in use, try again') }
  })
})

/**
 * @brief Sign user into application
 *
 * User will only be signed in if the provided username exists in DB
 * and the provided password matches the stored password
 */
mainRouter.post('/api/signIn', async (req, res) => {
  User.find({ username: req.body.username }, async (err, user) => {
    if (err) {
      res.status(400).send('Could not sign in, invalid username')
    } else {
      const match = await bcrypt.compare(req.body.password, user.passwordHash)
      if (match) { res.sendFile('profile.html', { root: req.app.get('views') }) } else { res.status(400).send('Could not sign in, invalid password') }
    }
  })
})

// Get from database as JSON
mainRouter.get('/api/myBills', (req, res) => {
  const query = `SELECT * FROM dbo.Bills WHERE userName = '${bills.get().payer}'`
  database.getAsJson(req, res, query)
})

mainRouter.get('/api/u-o-me', (req, res) => {
  const query = `SELECT member, Bills.billType, splitShare
          FROM dbo.BillMembers members INNER JOIN dbo.Bills bills
            ON members.payer = bills.userName AND members.billType = bills.billType
          WHERE members.payer = '${bills.get().payer}'
          ORDER BY  member`

  database.getAsJson(req, res, query)
})

mainRouter.get('/api/i-o-u', (req, res) => {
  const query = `SELECT payer, Bills.billType, splitShare
          FROM dbo.BillMembers members INNER JOIN dbo.Bills bills
            ON members.payer = bills.userName AND members.billType = bills.billType
          WHERE members.member = '${bills.get().payer}'
          ORDER BY  member`

  database.getAsJson(req, res, query)
})

/// ////////// Shared household routes //////////////////////
mainRouter.get('/api/household', (req, res) => {
  res.sendFile('household/index.html', { root: req.app.get('views') })
})

mainRouter.get('/api/household/create', (req, res) => {
  res.sendFile('household/create.html', { root: req.app.get('views') })
})

mainRouter.get('/api/household/list', (req, res) => {
  res.sendFile('household/list.html', { root: req.app.get('views') })
})

mainRouter.get('/api/household/assignedHouseholds', (req, res) => {
  res.json(householdList.getHouseholdList())
})

mainRouter.post('/api/household/create', (req, res) => {
  console.log(`${req.body.householdOwner}`)
  if (req.body.householdName && req.body.householdOwner) {
    householdList.addNewHouseHold({
      name: `${req.body.householdName}`,
      owner: `${req.body.householdOwner}`, // Owner should be the currently signed in user but I'l let them specify for now
      members: [`${req.body.householdOwner}`], // The Owner is the first member of the household
      allExpenses: [],
      settledExpenses: [],
      pendingExpenses: []
    })
  }

  console.log('Created shared houshold')
  res.redirect(req.baseUrl + '/api/household/list')
})

module.exports = mainRouter
