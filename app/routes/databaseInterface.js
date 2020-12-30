'use strict'

const db = require('./db.js')

// Runs queries on the database
const makeQueryToSQL = (sqlQuery) => {
  db.pools
    .then((pool) => {
      return pool.request()
        .query(sqlQuery, (err, row) => {
          if (err) { return err }
          return row
        })
    })
}

module.exports = {
  // Adds row at the Bills table for the bill to be saved
  saveBill: (billPayer, billAmount, numOfMembers, billType, spiltShare) => {
    const sqlQuery = `INSERT INTO dbo.Bills VALUES ('${billPayer}', '${billType}', '${billAmount}', '${numOfMembers}', ${spiltShare});`
    makeQueryToSQL(sqlQuery)
  },
  // Gets the Bills table
  getBills: () => {
    const sqlQuery = 'SELECT * FROM dbo.Bills'
    return makeQueryToSQL(sqlQuery)
  },
  // Adding members to bill
  saveMember: (payer, member, billType) => {
    const sqlQuery = `IF NOT EXISTS(SELECT * FROM dbo.BillMembers WHERE payer = '${payer}' AND member = '${member}' AND billType = '${billType}')
                      BEGIN
                      INSERT INTO dbo.BillMembers VALUES ('${payer}', '${member}', '${billType}')
                      END;`
    makeQueryToSQL(sqlQuery)
  },
  // Deletes bill from bills owed by user, then deletes bill if every owing member has settled
  settleBill: (payer, user, billType) => {
    const sqlQuery = `DELETE FROM dbo.BillMembers
                      WHERE payer = '${payer}' AND member = '${user}' AND billType = '${billType}'
                      IF NOT EXISTS(select * from dbo.BillMembers WHERE payer = '${payer}' AND billType = '${billType}' )
                      BEGIN
                      DELETE FROM dbo.Bills
                      WHERE userName = '${payer}' AND billType = '${billType}'
                      END`
    makeQueryToSQL(sqlQuery)
  },
  // Return query response as JSON
  getAsJson: (req, res, sqlQuery) => {
    db.pools
      .then((pool) => {
        return pool.request()
          .query(sqlQuery)
      })
      .then(result => {
        res.json(result.recordset)
      })
      .catch(err => {
        res.json({ Error: err })
      })
  }
}
