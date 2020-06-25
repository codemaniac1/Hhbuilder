const houseHoldDisplay = document.body.querySelector("ol");
const title = document.body.querySelector("h1");
const form = document.body.querySelector("form");
const addButton = form.querySelector(".add");
const formLabels = form.querySelectorAll("label");
const builderContainer = document.body.querySelector(".builder");

// apply some styles
const addStyles = () => {
    document.body.style.cssText = `background: #F6F9FF;`;

    title.style.cssText = `text-align: center;
                            margin: 2em 0;
                            color: #53627C;`;
    title.innerText = "Household Builder";

    builderContainer.style.cssText = `display: flex;`
    formLabels.forEach(label => label.style.cssText = `padding: 12px 0px 12px 0;`);
    form.style.cssText = `display: grid;
                      grid-auto-rows: 2.5em;
                      grid-row-gap: 1em;
                      margin: 0 auto;
                      width: 30%;
                        padding: 12px;
                        border: 1px solid #ccc;
                        border-radius: 4px;
                        box-sizing: border-box;
                        height: 30vh;
                        background-color: white;`;

    for (let i = 0; i < form.elements.length; i++) {
        form.elements[i].style.cssText = `border: 1px solid #ccc;
                                        border-radius: 5px;
                                        padding: 1em;
                                        box-sizing: border-box;
                                        `;
        if (i < 2) { // just the first 2 form fields
            form.elements[i].style.float = "right";
            form.elements[i].style.width = "70%";
            continue;
        } else if (i > 2) { // buttons
            form.elements[i].style.float = "right";
            form.elements[i].style.cursor = "pointer";
        }

        if (i === 4) { // submit button
            form.elements[i].style.border = "none";
            form.elements[i].style.color = "white";
            form.elements[i].style.padding = "14px 28px";
            form.elements[i].style.background = "#0b7dda";
        }
    }

    houseHoldDisplay.style.cssText = `overflow-y: scroll;
                                    max-height: 50vh;
                                    border: 2px solid #ccc;
                                    width: 20%;
                                    background: white`;
}


class HouseholdBuilder {
    constructor() {
        this.householdList = [];
    }

    // add will return true if there is an error during validation
    addMember(person) {
        if (this.validateRelationship(person.age) === false || this.validateRelationship(person.relationship) === false) {
            return true;
        }

        const newList = this.householdList.slice().concat([person]);
        this.householdList = newList;
    }

    removeMember(index) {
        const stateCopy = this.householdList.slice();
        const updatedState = [
            ...stateCopy.slice(0, index),
            ...stateCopy.slice(index + 1),
        ];

        this.householdList = updatedState;
    }

    displayHouseholdList() {
        const JSONData = JSON.stringify(this.householdList, null, '\t');
        return JSONData;
    }

    validateAge(age) {
        age = Number(age)
        // assuming the age is 1 and above
        return (!(age > 0) || !Number.isInteger(age)) ? false : true;
    }

    validateRelationship(relationship) {
        return relationship === "" ? false : true;
    }
}

class Member {
    constructor(age, relationship, smoker) {
        this.age = age;
        this.relationship = relationship;
        this.smoker = smoker;
    }
}

// displayData handles the final display of submitted data.
const displayData = (data) => {
    const formatter = document.body.querySelector(".debug");
    formatter.innerText = data;
    formatter.style.cssText = `display: block;
                               background: black;
                               color: white;
                               text-align: left;
                               max-height: 40vh;
                               overflow-y: scroll;
                               `;
}

const startApp = () => {
    const householdBuilder = new HouseholdBuilder();
    addStyles();

    let mode = null; // know when form is submitted

    // attach the event handlers
    addButton.addEventListener("click", (event) => {
        event.preventDefault();

        const age = form.elements[0].value;
        const relationship = form.elements[1].value;
        const smoker = form.elements[2].checked;
        const person = new Member(age, relationship, smoker);

        let error = householdBuilder.addMember(person);
        if (error === true) {
            alert("please check that age is above 0 and relationship is picked.")
            return
        }

        //  avoid creating elements if it fails validation
        let liElement = document.createElement("LI");
        let button = document.createElement("BUTTON");
        button.textContent = "remove";
        button.style.cssText = `border: none;
                                color: white;
                                padding: 14px 28px;
                                cursor: pointer;
                                background: #e68a00; `;

        // add event to remove a member
        button.addEventListener("click", (event) => {
            event.preventDefault();

            // get the position of the node  from the ordered list(houseHoldDisplay)
            // which is same as the index of the person in the houseHoldList
            // ref: https://stackoverflow.com/questions/13656921/fastest-way-to-find-the-index-of-a-child-node-in-parent
            const node = button.parentNode;
            const index = [].indexOf.call(node.parentNode.children, node);
            houseHoldDisplay.removeChild(button.parentNode);

            // update the list
            householdBuilder.removeMember(index);

            if (mode === "submit") {
                const householdData = householdBuilder.displayHouseholdList();
                displayData(householdData);
            }
        });

        liElement.innerHTML = `<p>Age: ${age}</p><p>Relationship: ${relationship}</p> <p>Smoker: ${smoker ? "yes" : "no"}</p>`;
        liElement.appendChild(button);
        houseHoldDisplay.appendChild(liElement);
    });

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        // set mode to submit
        mode = "submit";

        const householdData = householdBuilder.displayHouseholdList();
        displayData(householdData);
    });
};

// run the app
startApp();
