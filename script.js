'use strict';

$(document).ready(function(){

    // when the client click on pizza or sauce
    $(".btn-reservation").on('click', function(e) {
        const labelId = $(this).data("labelId");
        const btnType = $(this).data("buttonType");

        const cost = $('#' + labelId).data("cost");
        const isSauce = $('#' + labelId).data("type");
        changePizzaAmount(labelId, btnType, cost, isSauce);
        e.preventDefault();
    });

    $(document).on("click", ".append-pizza-modal" , function() {
        callModal($(this).data("pizzaId"));
    });
  
 
    $('#pizzaExtra').on('hide.bs.modal', function (e) {
       
        let extraPizza = new Map();
        extraPizza = setEextraPizzaMap();
       initChececkBoxExtraPizza(extraPizza, false);
       // init the price
       $("#price").html(price);
       tempPrice = 0;
       countExtraPizzaChoose = 0;
        // do something…
    })


    let pageNumber = 1;
    let price = 0;
    let bigPizza, famillyPizza, smallPizza;
    var allextraPizzaChoose = [];
    var allPizzaId = [];
    var drinksChoose = [];
    var countExtraPizzaChoose = 0;
    let sauceChoose = [];
    var tempPrice = 0;

    // Remove or add 1 to input text of the pizzaId
    function changePizzaAmount(id, btnType, cost, type){
    

        if(type === "sauce"){
            const hebrewName = document.getElementById(id).getAttribute('data-name');
            saucesChoose(id, hebrewName, btnType);
        }

        else { // pizza
            let amountPizza = $(`#${id}`).text();
            if(btnType === 'add'){
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
            $(`#${id}`).html(amountPizza);
        }
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
            
                $("#bigPizzaSummary").append(`<p class="text-right btn w-100 pr-0 append-pizza-modal" data-toggle="modal" data-target="#pizzaExtra" data-pizza-id="bigpizza${i}">לחץ להוספת תוספת לפיצה מספר ${i + 1}</p>`);
            // $("#bigPizzaSummary").click(callModal('bigpizza' + i));
                allPizzaId.push(`bigpizza${i}`);
            }
        }

        if(famillyPizza){
            $("#famillyPizzaSummary").append("<h3 class='text-right'>פיצה משפחתית:</h3>");
            
            for(let i = 0; i < famillyPizza; i++){
                $("#famillyPizzaSummary").append(`<p class="text-right btn w-100 pr-0 append-pizza-modal"  data-toggle="modal" data-target="#pizzaExtra" data-pizza-id="famillypizza${i}">לחץ להוספת תוספת לפיצה מספר ${i + 1}</p>`)
                //$("#famillyPizzaSummary").click(callModal('famillypizza' + i));
                allPizzaId.push(`famillypizza${i}`);

            }
        }

        if(smallPizza){
            $("#smallPizzaSummary").append("<h3 class='text-right'>פיצה אישית:</h3>");
            
            for(let i = 0; i < smallPizza; i++){
                $("#smallPizzaSummary").append(`<p class="text-right btn w-100 pr-0 append-pizza-modal" data-toggle="modal" data-target="#pizzaExtra" data-pizza-id="smallpizza${i}">לחץ להוספת תוספת לפיצה מספר ${i + 1}</p>`)
            // $("#smallPizzaSummary").click(callModal('smallpizza' + i));;
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

            this.checked ? tempPrice += priceOfExtraPizza  : tempPrice -= priceOfExtraPizza;
        
        
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
            $("#price").html(price + tempPrice);

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
        $("#print").removeClass('d-none');


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
        // checked if exist pizza
        console.log(allextraPizzaChoose);
        const isExist = isExtraPizzaChoose(pizzaId);

        if(isExist !== false) { 
            // if the client want to change is extra pizzza
            initTheExtraPizza(allextraPizzaChoose[isExist].extraPizzaCheckedId);
        }

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


    // init the extra pizza that was choose
    function initTheExtraPizza(extraPizzaCheckedId){
        extraPizzaCheckedId.forEach(el => {
            $('#' + el).prop('checked', true);
        })
    }

    // need to check if exist, if exist return the index else return false
    function isExtraPizzaChoose(pizzaId){
        let isExist = false;
        allextraPizzaChoose.forEach((extra, index) =>{
            if(extra.pizzaId === pizzaId)
                isExist = index;
        });
        return isExist;
    }


    $("#saveExtraPizza").click((ev)=> {
        
        // init the price
        price +=  tempPrice;
        tempPrice = 0;

        countExtraPizzaChoose = 0; // איפוס התוספות שנבחרו
        const pizzaId = document.getElementById('pizzaExtra').getAttribute('data-pizza-id');
        
        let extraPizzaChecked = new extraPizzaChoose(pizzaId);
        let extraPizzaCheckedId = [];
        let extraPizza = new Map();
        extraPizza = setEextraPizzaMap();

        extraPizza.forEach((value, key, map) => {
            let isChecked = document.getElementById(key).checked;
            if(isChecked === true){
                if(key === "tomato"){
                    extraPizzaChecked.tomato = true;
                    extraPizzaCheckedId.push(key);
                }
                else if(key === "onion"){
                    extraPizzaChecked.onion = true;
                    extraPizzaCheckedId.push(key);
                }
                else if(key === "machroom"){
                    extraPizzaChecked.machroom = true;
                    extraPizzaCheckedId.push(key);
                }
                else if(key === "corn"){
                    extraPizzaChecked.corn = true;
                    extraPizzaCheckedId.push(key);
                }
                else if(key === "extraCheese"){
                    extraPizzaChecked.extraCheese = true;
                    extraPizzaCheckedId.push(key);
                }
                else if(key === "greenOlive"){
                    extraPizzaChecked.greenOlive = true;
                    extraPizzaCheckedId.push(key);
                }
                else{
                    extraPizzaChecked.blackOlive = true;
                    extraPizzaCheckedId.push(key);
                }
            }
        });

        let obj = {};
        document.getElementById('halfPizza').checked ? obj["howMuch"] = "חצי מגש" : obj["howMuch"] = "מגש שלם";
        obj["comment"] = $("#comment").val();
        obj["pizzaId"] = extraPizzaChecked.pizzaId;
        obj["extraPizzaChecked"] = extraPizzaChecked.extraPizzaChoose();
        obj["extraPizzaCheckedId"] = extraPizzaCheckedId;
        
        // need to check if exist, if exist return the index else return false
        let isExist = false;
        allextraPizzaChoose.forEach((extra, index) =>{
            if(extra.pizzaId === pizzaId)
                isExist = index;
        });
        
        isExist === false ? allextraPizzaChoose.push(obj) : allextraPizzaChoose[isExist] = obj;

        initChececkBoxExtraPizza(extraPizza, true); 
    });

    
    // ביטול כל התוספות שנבחרו לפיצה
    function initChececkBoxExtraPizza(extraPizza, hideModal){
        if(hideModal === true)
            $('#pizzaExtra').modal('hide');
        extraPizza.forEach((value, key, map) => {
            $(`#${key}`).prop("checked", false);
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
        extraPizza.set('greenOlive', 'זיתים ירוקים');
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
            this.greenOlive === true ? this.chooseExtra.push("זיתים ירוקים") : "";
            this.extraCheese === true ? this.chooseExtra.push("אקסטרה גבינה") : "";

            if(this.chooseExtra.length > 0)
                return this.chooseExtra;
            else
                return "ללא תוספות";
        }
    }

    //sauce choose
    function saucesChoose(id, sauceHebrewName, btnType){
        let curretValue = parseInt($("#" + id).text());

        if(btnType === 'add'){

            $("#" + id).html(++curretValue);
            
        }
        else{
            if(curretValue > 0)
                $("#" + id).html(--curretValue);
        }

        let obj = {};
        obj["id"] = id;
        obj["sauceHebrewName"] = sauceHebrewName;
        let sauceExistIndex = sauceExist(id);

        if(sauceExistIndex === false){
            
            obj["amount"] = curretValue;
            sauceChoose.push(obj);
        
        }
        else{
            
            sauceChoose[sauceExistIndex].amount = curretValue;
        }

        let amountSaucePrice = 0;
        sauceChoose.map(sauce => amountSaucePrice += parseInt(sauce.amount));
        if(amountSaucePrice > 0){
            // first sauce is free
            amountSaucePrice = (amountSaucePrice - 1) * 2;
        }

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



    // print method before and after print
    let mediaQueryList = window.matchMedia('print');
    mediaQueryList.addListener(function(mql) {
        if (mql.matches) { //before print dialog open
        
            $("button").addClass('d-none');
            $("#totalToPayText").addClass('d-none');

        } else { //after print dialog closed
            
            $("button").removeClass('d-none');
            $("#totalToPayText").removeClass('d-none');
        }
    });
})
