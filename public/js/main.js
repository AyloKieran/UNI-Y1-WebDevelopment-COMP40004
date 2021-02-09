let order = [];

loadForm();

function initialize() {
    if (localStorage.getItem('loyaltyPoints') == null) {
        localStorage.setItem('loyaltyPoints', 0);
    }

    let btnAddtoOrder = document.getElementById("addtoorder");
    btnAddtoOrder.addEventListener("click", addToOrder);
    let btnPlaceOrder = document.getElementById("placeorder");
    btnPlaceOrder.addEventListener("click", placeOrder);
    let btnAddFavoruite = document.getElementById("setfavourite");
    btnAddFavoruite.addEventListener("click", setFavourite);
    let btnSetFavoruite = document.getElementById("getfavourite");
    btnSetFavoruite.addEventListener("click", getFavourite);

    let formInputs = document.querySelectorAll("input");
    for (let i = 0; i < formInputs.length; i++) {
        formInputs[i].addEventListener("change", updateForm);
    };
}

function addToOrder() {
    event.preventDefault();
    drink = getDrink();
    order.push(drink);
    if (drink["loyalty"] == true) {
        useLoyalty();
    }
    resetForm();
    displayOrder();
}

function formatPrice(cost) {
    return cost.toFixed(2);
}

function calculateCost(drinkObject) {
    let totalCost = 0.0;
    let size = drinkObject["size"];
    let cream = drinkObject["extras"]["cream"];
    let syrup = drinkObject["extras"]["syrup"];
    let loyalty = drinkObject["loyalty"];

    if (loyalty == true) {
        return 0.00;
    } else {
        if (size == "small") {
            totalCost += 2.45;
        } else if (size == "medium") {
            totalCost += 2.65;
        } else {
            totalCost += 2.85;
        }

        if (cream) {
            totalCost += 0.50;
        }

        if (syrup > 0) {
            totalCost += (syrup * 0.25);
        }

        return totalCost;
    }
}

function getDrink() {
    let drinkObject = {
        "choice": null,
        "size": null,
        "milk": null,
        "extras": {
            "sugar": null,
            "cream": null,
            "syrup": null
        },
        "loyalty": false
    };

    let choice = document.querySelector("input[name='choice']:checked").value;
    let size = document.querySelector("input[name='size']:checked").value;
    let milk = document.querySelector("input[name='milk']:checked").value;
    let extrasugar = document.querySelector("input[name='extrasugar']").checked;
    let extracream = document.querySelector("input[name='extracream']").checked;
    let syrup = document.querySelector("input[name='syrup']").value;
    let loyalty = checkLoyalty();

    drinkObject["choice"] = choice;
    drinkObject["size"] = size;
    drinkObject["milk"] = milk;
    drinkObject["extras"]["sugar"] = extrasugar;
    drinkObject["extras"]["cream"] = extracream;
    drinkObject["extras"]["syrup"] = syrup;
    drinkObject["loyalty"] = loyalty;

    return drinkObject;
}

function updateForm() {
    let milkField = document.getElementById("milkField");
    let choice = document.querySelector("input[name='choice']:checked").value;
    let drinkCost = document.getElementById("drinkCost");

    if (choice == "Latte" || choice == "Cappuccino" || choice == "Flat White") {
        milkField.disabled = false;
    } else {
        milkField.disabled = true;
    }

    drinkCost.innerHTML = "Current Drink: £" + formatPrice(calculateCost(getDrink()));
}

function resetForm() {
    let choice = document.querySelectorAll("input[name='choice']");
    let size = document.querySelector("input[name='size'][id='medium']");
    let milkitem = document.querySelector("input[name='milk'][id='semiskimmed']");
    let milkField = document.getElementById("milkField");
    let extrasugar = document.querySelector("input[name='extrasugar']");
    let extracream = document.querySelector("input[name='extracream']");
    let syrup = document.querySelector("input[name='syrup']");
    let drinkCost = document.getElementById("drinkCost");

    for (let i = 0; i < choice.length; i++) {
        choice[i].checked = false;
    }
    size.checked = true;
    milkitem.checked = true;
    milkField.disabled = true;
    extrasugar.checked = false;
    extracream.checked = false;
    syrup.value = 0;
    drinkCost.innerHTML = "Current Drink: £" + formatPrice(0);
}

function displayOrder() {
    let currentOrder = document.getElementById("currentOrder");
    let totalCost = 0.0;

    for (let i = currentOrder.childNodes.length - 1; i >= 0; i--) {
        currentOrder.removeChild(currentOrder.childNodes[i]);
    }

    for (let i = 0; i < order.length; i++) {
        orderItem = document.createElement("li");
        orderCost = calculateCost(order[i]);
        totalCost += orderCost;

        let choice = order[i]["choice"];
        let size = order[i]["size"];
        let milk = order[i]["milk"];
        let sugar = order[i]["extras"]["sugar"];
        let cream = order[i]["extras"]["cream"];
        let syrup = order[i]["extras"]["syrup"];
        let loyalty = order[i]["loyalty"];

        text = choice + " (" + size;

        if (choice == "Latte" || choice == "Cappuccino" || choice == "Flat White") {
            text += ", " + milk;
        };

        if (sugar) {
            text += ", extra sugar";
        }

        if (cream) {
            text += ", extra cream";
        }

        if (syrup > 0) {
            text += ", " + syrup + " shot(s) of syrup";
        }

        if (loyalty == true) {
            text += ", LOYALTY";
        }

        text += ") - £" + formatPrice(orderCost);

        textNode = document.createTextNode(text);
        orderItem.appendChild(textNode);
        currentOrder.appendChild(orderItem);
    }

    currentOrder.appendChild(document.createTextNode("Total Cost: £" + formatPrice(totalCost)));
}

function placeOrder() {
    var alert = confirm("Are you sure you want to place this order?")

    if (alert == true) {
        let currentOrder = document.getElementById("currentOrder");

        for (let i = 0; i < order.length; i++) {
            addLoyalty();
        }

        for (let i = currentOrder.childNodes.length - 1; i >= 0; i--) {
            currentOrder.removeChild(currentOrder.childNodes[i]);
        }

        orderItem = document.createElement("li");
        textNode = document.createTextNode("Thank you for your order!");
        orderItem.appendChild(textNode);
        currentOrder.appendChild(orderItem);

        resetForm();
        order = []
    }
}

function addLoyalty() {
    localStorage.setItem('loyaltyPoints', parseInt(localStorage.getItem('loyaltyPoints')) + 1);
}

function useLoyalty() {
    localStorage.setItem('loyaltyPoints', localStorage.getItem('loyaltyPoints') - 10);
}

function checkLoyalty() {
    let loyaltyPoints = localStorage.getItem('loyaltyPoints');

    if (loyaltyPoints < 10) {
        return false
    } else {
        return true
    }
}

function setForm(drink) {
    let choice = drink["choice"];
    let size = drink["size"];
    let milk = drink["milk"];
    let sugar = drink["extras"]["sugar"];
    let cream = drink["extras"]["cream"];
    let syrup = drink["extras"]["syrup"];

    document.querySelector("input[name='choice'][value='" + choice + "']").checked = true;
    document.querySelector("input[name='size'][id='" + size + "']").checked = true;
    document.querySelector("input[name='milk'][id='" + milk + "']").checked = true;
    document.querySelector("input[name='extrasugar']").checked = sugar;
    document.querySelector("input[name='extracream']").checked = cream;
    document.querySelector("input[name='syrup']").value = syrup;

    updateForm();
}

function setFavourite() {
    drink = getDrink();
    localStorage.setItem('favouriteDrink', JSON.stringify(drink));
}

function getFavourite() {
    drink = JSON.parse(localStorage.getItem('favouriteDrink'));
    setForm(drink);
    addToOrder();
}

function loadForm() {
    fetch("./js/drinks.json").then(function(response){ 
            return response.text();       
        }).then(function(data){
            createForm(data)
        }).catch(function(error){
            console.log(`Error - ${error}`);
        }).finally(function() {
            initialize();
        });
}

function createForm(data) {
    drinks = JSON.parse(data);

    let choiceForm = document.querySelector("fieldset[id='choice']");
    let milkForm = document.querySelector("fieldset[id='milkField']");

    for (drink in drinks.drinks) {
        drink = drinks["drinks"][drink];
        name = drink["name"];
        id = drink["id"];

        p = document.createElement("p");
        input = document.createElement("input");
        input.setAttribute("type", "radio");
        input.setAttribute("id", id);
        input.setAttribute("name", "choice");
        input.setAttribute("value", name);

        label = document.createElement("label");
        label.setAttribute("for", id);

        text = document.createTextNode(name);
        label.appendChild(text);

        p.appendChild(input);
        p.appendChild(label);
        choiceForm.appendChild(p);
    }

    for (milk in drinks.milk) {
        milk = drinks["milk"][milk];
        name = milk["name"];
        id = milk["id"];
        enabled = milk["default"];

        p = document.createElement("p");
        input = document.createElement("input");
        input.setAttribute("type", "radio");
        input.setAttribute("id", id);
        input.setAttribute("name", "milk");
        input.setAttribute("value", id);

        if (enabled == true) {
            input.checked = true;
        }

        label = document.createElement("label");
        label.setAttribute("for", id);

        text = document.createTextNode(name);
        label.appendChild(text);

        p.appendChild(input);
        p.appendChild(label);
        milkForm.appendChild(p);
    }
}