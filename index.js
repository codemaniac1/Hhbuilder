const houseHoldDisplay = document.body.querySelector("ol");

class HouseholdBuilder {
    constructor() {
        this.householdList = [];
    }

    add(person) {
        // TODO: Validation should be done from here
        const newList = this.householdList.slice().concat([person]);
        this.householdList = newList;
        console.log("household add people: ", this.householdList);
    }

    remove(index) {
        const stateCopy = this.householdList.slice();
        const updatedState = [
            ...stateCopy.slice(0, index),
            ...stateCopy.slice(index + 1),
        ];

        this.householdList = updatedState;
        console.log(this.householdList);
    }

    displayHouseholdList() {
        const JSONData = JSON.stringify(this.householdList, null, '\t');
        console.log(JSONData);
        return JSONData;
    }
}

class Person {
    constructor(age, relationship, smoker) {
        this.age = age;
        this.relationship = relationship;
        this.smoker = smoker;
    }

    static validateAge(age) {
        age = Number(age)

        return (age < 1 || !Number.isInteger(age)) ? false : true;
    }

    static validateRelationship(relationship) {
        return relationship === "" ? false : true;
    }
}

const householdBuilder = new HouseholdBuilder();

const form = document.body.querySelector("form");
const addButton = document.body.querySelector(".add");

// attach the event handlers
// TODO: target the element by name
addButton.addEventListener("click", (event) => {
    event.preventDefault(); // remove it not needed
    const age = form.elements[0].value;
    const relationship = form.elements[1].value;
    const smoker = form.elements[2].checked;

    let valid = true;
    valid = Person.validateAge(age);
    valid = Person.validateRelationship(relationship);

    console.log("valid", valid);

    if (!valid) {
        alert("please check that age is above 0 and relationship is picked.")
        return
    }

    //  avoid creating elements if it fails validation
    let liElement = document.createElement("LI");

    let button = document.createElement("BUTTON");
    button.className = "remove";
    button.textContent = "remove";

    // add event to remove an entry
    button.addEventListener("click", (event) => {
        event.preventDefault();

        //liElement.parentNode.removeChild(liElement);
        // get the position of the node  from the ordered list(houseHoldDisplay)
        // which is same as the index of the person in the houseHoldList
        // ref: https://stackoverflow.com/questions/13656921/fastest-way-to-find-the-index-of-a-child-node-in-parent
        const node = button.parentNode;
        const index = [].indexOf.call(node.parentNode.children, node);

        console.log("node index", index);

        houseHoldDisplay.removeChild(button.parentNode);

        // update the list
        householdBuilder.remove(index);
    });


    liElement.innerText = age;
    liElement.appendChild(button);

    houseHoldDisplay.appendChild(liElement);

    const person = new Person(age, relationship, smoker);

    householdBuilder.add(person);
});

const displayData = (data) => {
    const formatter = document.body.querySelector(".debug");
    console.log(formatter, data);
    formatter.innerText = data;

    formatter.style.display = "block";
    formatter.style.background = "black";
    formatter.style.color = "white";
}

form.addEventListener("submit", (event) => {
    event.preventDefault();

    const householdData = householdBuilder.displayHouseholdList();
    displayData(householdData);
});
