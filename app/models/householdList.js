let householdList = []; //@TODO - Replace array with database

module.exports = {
  addNewHouseHold: function (household) {
    householdList.push(household)
  },
  getHouseholdList: function(){
    return householdList
  }
}