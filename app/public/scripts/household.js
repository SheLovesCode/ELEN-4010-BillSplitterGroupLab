const createElement = function (tag, text) {
    const element = document.createElement(tag)
    element.textContent = text
    return element
}

const populateHouseholdList = function (sharedHouseholdList) {
    const householdList = document.createElement('ol')
    sharedHouseholdList.forEach((household) => {
        let householdDetails = createElement('li', `${household.name} household, owned by ${household.owner} with ${household.members.length} member(s)`)
        householdList.appendChild(householdDetails)
    })
    let targetDiv = document.getElementById('shared-household-list')
    targetDiv.appendChild(householdList)
}

window.addEventListener('load', function (e){
    fetch('/api/household/assignedHouseholds')
      .then((response) => {
          if(response.ok) return response.json()
          else throw 'Failed to load household list'
      })
      .then((data) => {
          populateHouseholdList(data);
      })
      .catch((e)=>{
          alert(e)
      })
    console.log('populated houshold')
})