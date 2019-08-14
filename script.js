'use strict';


let pageNumber = 1;
let price = 0;
let bigPizza, famillyPizza, smallPizza;
var allextraPizzaChoose = [];
var allPizzaId = [];
var drinksChoose = [];
var countExtraPizzaChoose = 0;
let sauceChoose = [];

// remove or add 1 to input text of the pizzaId
function changePizzaAmount(pizzaId, type, cost){

    let amountPizza = $(`#${pizzaId}`).text();
    if(type === 'add'){
        price += cost;
        amountPizza++;
    }
    
    else{
        if(amountPizza > 0){
            amountPizza = parseInt(amountPizza) - 1;
            price -= cost;
        } 
    }
    $("#price").html(price);
    $(`#${pizzaId}`).html(amountPizza);
}



$("#continueBtn").click((ev) =>{

    if(pageNumber === 1){

        firstPage();
        secondPage();
    }
    else if(pageNumber === 2){
        updatePrice();
        thirdPage();
    }
    else if(pageNumber === 3){
        summaryOrder();
    }

    pageNumber++;
});

function firstPage(){

    // Change the position of the buttons
    $('#btn-continue-and-reload').removeClass('justify-content-end');
    $('#btn-continue-and-reload').addClass('justify-content-between');

    bigPizza = parseInt($("#bigPizza").text());    
    famillyPizza = parseInt($("#famillyPizza").text());    
    smallPizza = parseInt($("#smallPizza").text());    
    // remove cuurent page
    $("#pizzaReservation").addClass("d-none");
    // init the next page
    $("#pizzaSummary").removeClass("d-none");
}

function secondPage(){
    
    $("#btnReload").removeClass("d-none");

    if(bigPizza){
        $("#bigPizzaSummary").append("<h3 class='text-right'>פיצה ענקית:</h3>");
        for(let i = 0; i < bigPizza; i++){
        
            $("#bigPizzaSummary").append(`<p class="text-right btn w-100 pr-0" data-toggle="modal" data-target="#pizzaExtra" onclick=callModal('bigpizza${i}')>לחץ להוספת תוספת לפיצה מספר ${i + 1}</p>`);
            allPizzaId.push(`bigpizza${i}`);
        }
    }

    if(famillyPizza){
        $("#famillyPizzaSummary").append("<h3 class='text-right'>פיצה משפחתית:</h3>");
        
        for(let i = 0; i < famillyPizza; i++){
            $("#famillyPizzaSummary").append(`<p class="text-right btn w-100 pr-0"  data-toggle="modal" data-target="#pizzaExtra" onclick=callModal('famillypizza${i}')>לחץ להוספת תוספת לפיצה מספר ${i + 1}</p>`);
            allPizzaId.push(`famillypizza${i}`);

        }
    }

    if(smallPizza){
        $("#smallPizzaSummary").append("<h3 class='text-right'>פיצה אישית:</h3>");
        
        for(let i = 0; i < smallPizza; i++){
            $("#smallPizzaSummary").append(`<p class="text-right btn w-100 pr-0" data-toggle="modal" data-target="#pizzaExtra" onclick=callModal('smallpizza${i}')>לחץ להוספת תוספת לפיצה מספר ${i + 1}</p>`);
            allPizzaId.push(`smallpizza${i}`);

        }
    }

}

function thirdPage(){
    $("#pizzaSummary").addClass("d-none");
    $("#drinkOption").removeClass("d-none");
}



$(".extra-pizza").click(function(ev) {

    const el = ev.target.id;
    let priceOfExtraPizza;

    if(el !== "halfPizza" && el !== "allPizza"){

        const pizzaId = document.getElementById('pizzaExtra').getAttribute('data-pizza-id');
     
        priceOfExtraPizza = funcPriceOfExtraPizza(pizzaId, el);

        // בדיקה אם נבחר יותר משתי תוספות
        this.checked ? countExtraPizzaChoose++ : countExtraPizzaChoose--;

        this.checked ? price += priceOfExtraPizza  : price -= priceOfExtraPizza;
    
    
        if(countExtraPizzaChoose > 2) { // to much
            $('#extra-pizza-message-error').removeClass('d-none');
            $("#saveExtraPizza").attr("disabled", true);
        }
        else{
            if($('#extra-pizza-message-error').hasClass('d-none') === false){
                $('#extra-pizza-message-error').addClass('d-none');
                $("#saveExtraPizza").attr("disabled", false);
            }
        }
        $("#price").html(price);

    }

    function funcPriceOfExtraPizza(pizzaId, el){

        let returnPrice;
        // הפונקציה מחזירה את מחיר התופסת על פי גודל המגש
        if(pizzaId.includes("big")){
            el === "extraCheese" ? returnPrice = 8 : returnPrice = 7;
        }
        else if(pizzaId.includes("familly")){
            el === "extraCheese" ? returnPrice = 6 : returnPrice = 5;         
        }
        else{ // small pizza
            el === "extraCheese" ? returnPrice = 3 : returnPrice = 2;    
        }

        return returnPrice;
    }
});



$(".drink-choose").click(function(ev) {
    let drinkCost = $(this).data("cost");
    let pizzaId = $(this).attr('id');
    let drinkHebrewName = $('label[for="' + pizzaId + '"]')[0].innerText;

    if(this.checked){
        price += drinkCost;
        drinksChoose.push(drinkHebrewName);
    }

    else{
        price -= drinkCost;
        let index = drinksChoose.indexOf(drinkHebrewName); 
        index > -1 ? drinksChoose.splice(index, 1) : "";
    }

 
    console.log(drinksChoose);
    $("#price").html(price);
})


function summaryOrder(){
    $("#totalToPayText").removeClass("d-none");
    $("#drinkOption").addClass("d-none");
    $("#orderSummary").removeClass('d-none');


    // drinks choose
    if(drinksChoose.length > 0){
        $("#drinkSummary").removeClass('d-none');
        drinksChoose.forEach(drink =>{
            $("#drinkSummary").append(`<p>${drink}</p>`);
        })
    }
    if(sauceChoose.length > 0){
        $("#saucesSummary").removeClass('d-none');

        sauceChoose.forEach(sauce =>{
            $("#saucesSummary").append(`<p>
            <span>סוג רוטב: ${sauce.sauceHebrewName}</span><br/>
            <span>כמות רוטב: ${sauce.amount}</span>
            </p>`);
        })
    }

    if(allPizzaId.length > 0){
        allPizzaId.forEach(pizzaId =>{

            let isExtraPizzaId = returnExtraPizza(pizzaId);
            let pizzaSize = returnPizzaSize(pizzaId);

            let node = document.createElement("div");
            node.className = "font-weight-bold";
            let divPizzaSize = document.createTextNode(`${pizzaSize}`);
            node.appendChild(divPizzaSize);
            document.getElementById("pizzaSummaryOrder").appendChild(node);



            if(isExtraPizzaId !== false){ // the pizza has extra

                // תוסםת על מגש שלם או חצי מגש
                let divHowMuch = document.createElement("div");

                divHowMuch.className = "col-12 pr-0 mb-2";
                let txtHowMuch = document.createTextNode(`תוספת על: ${isExtraPizzaId["howMuch"]}`);
                divHowMuch.appendChild(txtHowMuch);
                document.getElementById("pizzaSummaryOrder").appendChild(divHowMuch);
                
                // הוספת התוספות לפיצה
                let nodeExtraChoose = document.createElement("div");
                let spanDivPizzaExtra = "תוספות לפיצה:";

                isExtraPizzaId["extraPizzaChecked"].forEach(ex => {
                    spanDivPizzaExtra += ` ${ex}, `;
                }); 
                //remove the , and the space
                spanDivPizzaExtra = spanDivPizzaExtra.substring(0, spanDivPizzaExtra.length - 2);

                let divPizzaExtra = document.createTextNode(spanDivPizzaExtra);

                nodeExtraChoose.appendChild(divPizzaExtra);
                document.getElementById("pizzaSummaryOrder").appendChild(divPizzaExtra);

                // COMMENT
                let nodeComment = document.createElement("div");
                nodeComment.className = "font-weight-bold mb-2";
                let divNodeComment = document.createTextNode(` הערה: ${isExtraPizzaId["comment"]}`);
                nodeComment.appendChild(divNodeComment);
                document.getElementById("pizzaSummaryOrder").appendChild(nodeComment);
                
            }

            else { //the pizza doesn't has extra
                $("#pizzaSummaryOrder").append(`<p class="mt-0 ">ללא תוספות</p>`);

            }
        })
    }
}

// return the size of the pizza (big, small, familly)
function returnPizzaSize(pizzaId){
    if(pizzaId.includes("big")){
        return "פיצה ענקית";
    }
    else if(pizzaId.includes("small")){
        return "פיצה אישית"
    }
    else{
        return "פיצה משפחתית"
    }
}

// check if the pizza has extra and return it
function returnExtraPizza(pizzaId){
    let currentPizza = false;
    if(allextraPizzaChoose.length > 0){
        allextraPizzaChoose.forEach(pizza =>{
            if(pizza.pizzaId === pizzaId){
                currentPizza = pizza;
            }
        });
    }

    return currentPizza;
}

function callModal(pizzaId){
    document.getElementById('pizzaExtra').setAttribute('data-pizza-id', pizzaId);
    $("#extraPizzaCost").html("");
    if(pizzaId.includes("big")){
        $("#extraPizzaCost").append(`מחיר תוספת הוא 6 ש"ח, תוספת גבינה מחירה 8 ש"ח`);
    }
    else if(pizzaId.includes("small")){
        $("#extraPizzaCost").append(`מחיר תוספת הוא 2 ש"ח, תוספת גבינה מחירה 3 ש"ח`);
    }
    else{
        $("#extraPizzaCost").append(`מחיר תוספת הוא 5 ש"ח, תוספת גבינה מחירה 6 ש"ח`);
    }

}




$("#saveExtraPizza").click((ev)=> {
    
    countExtraPizzaChoose = 0; // איפוס התוספות שנבחרו
    const pizzaId = document.getElementById('pizzaExtra').getAttribute('data-pizza-id');
    
    let extraPizzaChecked = new extraPizzaChoose(pizzaId);
    let extraPizza = new Map();
    extraPizza = setEextraPizzaMap();

    extraPizza.forEach((value, key, map) => {
        let isChecked = document.getElementById(key).checked;
        if(isChecked === true){
            if(key === "tomato"){
                extraPizzaChecked.tomato = true;
            }
            else if(key === "onion"){
                extraPizzaChecked.onion = true;
            }
            else if(key === "machroom"){
                extraPizzaChecked.machroom = true;
            }
            else if(key === "corn"){
                extraPizzaChecked.corn = true;
            }
            else if(key === "extraCheese"){
                extraPizzaChecked.extraCheese = true;
            }
            else if(key === "greenOlive"){
                extraPizzaChecked.greenOlive = true;
            }
            else{
                extraPizzaChecked.blackOlive = true;
            }
        }
    });

    let obj = {};
    document.getElementById('halfPizza').checked ? obj["howMuch"] = "חצי מגש" : obj["howMuch"] ="מגש שלם";
    obj["comment"] = $("#comment").val();
    obj["pizzaId"] = extraPizzaChecked.pizzaId;
    obj["extraPizzaChecked"] = extraPizzaChecked.extraPizzaChoose();
    allextraPizzaChoose.push(obj);
    initChececkBoxExtraPizza(extraPizza); 
});

// ביטול כל התוספות שנבחרו לפיצה
function initChececkBoxExtraPizza(extraPizza){
    $('#pizzaExtra').modal('hide');
    extraPizza.forEach((value, key, map) => {
        $(`#${key}`). prop("checked", false);
    });
    document.getElementById('halfPizza').checked = false;
    document.getElementById('allPizza').checked = false;

    $("#comment").val("");
}

function setEextraPizzaMap(){
    let extraPizza = new Map();
    extraPizza.set('tomato', 'עגבניה');
    extraPizza.set('onion', 'בצל');
    extraPizza.set('machroom', 'פטריות');
    extraPizza.set('corn', 'תירס');
    extraPizza.set('blackOlive', 'זיתים שחורים');
    extraPizza.set('greenOlive', 'זיתים ירוקות');
    extraPizza.set('extraCheese', 'אקסטרה גבינה');

    return extraPizza;
}

class extraPizzaChoose {
    constructor(pizzaId){

        this.pizzaId = pizzaId;
        this.tomato = false;
        this.onion = false;
        this.machroom = false;
        this.corn = false;
        this.blackOlive = false;
        this.greenlive = false;
        this.extraCheese = false;
        this.chooseExtra = [];
    }

    extraPizzaChoose(){
        this.tomato === true ? this.chooseExtra.push("עגבניה") : "";
        this.onion === true ? this.chooseExtra.push("בצל") : "";
        this.machroom === true ? this.chooseExtra.push("פטריות") : "";
        this.corn === true ? this.chooseExtra.push("תירס") : "";
        this.blackOlive === true ? this.chooseExtra.push("זיתים שחורים") : "";
        this.greenkOlive === true ? this.chooseExtra.push("זיתים ירוקות") : "";
        this.extraCheese === true ? this.chooseExtra.push("אקסטרה גבינה") : "";

        if(this.chooseExtra.length > 0)
            return this.chooseExtra;
        else
            return "ללא תוספות";
    }
}

//sauce choose
function saucesChoose(id, sauceHebrewName){
    
    let amount = $("#" + id).val();
    let obj = {};
    obj["id"] = id;
    obj["sauceHebrewName"] = sauceHebrewName;
    let sauceExistIndex = sauceExist(id);
    if(sauceExistIndex === false){
        
        obj["amount"] = amount;
        sauceChoose.push(obj);
       
    }
    else{
        
        sauceChoose[sauceExistIndex].amount = amount;
    }

    let amountSaucePrice = 0;
    sauceChoose.map(sauce => amountSaucePrice += parseInt(sauce.amount));
    amountSaucePrice = (amountSaucePrice - 1) * 2;

    $("#price").html(amountSaucePrice + price);
   
}

// if the sauce exist return the index else return false
function sauceExist(id){
    for(let i = 0; i < sauceChoose.length; i++){
        if(sauceChoose[i].id === id)
            return i;
    }
    return false;
}

function updatePrice(){
    price = parseInt($("#price").text());
}

