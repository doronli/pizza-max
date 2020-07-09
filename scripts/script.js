'use strict';

let pageNumber = 0;
var price = 0, pizzaPrice = 0, extraPizzaPrice = 0, saucePrice = 0, drinksPrice = 0;
let bigPizza, famillyPizza, smallPizza;
var allextraPizzaChoose = [];
var allPizzaId = [];
var drinksChoose = [];
var countExtraPizzaChoose = 0;
let sauceChoose = [];
var tempPrice = 0;
let errorsList = {quantity: false, extraPizza: false};
let screenIds = ['pizzaReservation', 'pizzaSummary', 'chooseSauce', 'drinkOption', 'orderSummary'];

    //connect();
    // when the client click on pizza or sauce
    $(".btn-reservation").on('click', function(e) {
        const labelId = $(this).data("labelId");
        const btnType = $(this).data("buttonType");

        const cost = $('#' + labelId).data("cost");
        const isSauce = $('#' + labelId).data("type");
        changePizzaAmount(labelId, btnType, cost, isSauce);
        e.preventDefault();
    });

    // when the modal is open this function 
    $(document).on("click", ".append-pizza-modal" , function() {
        callModal($(this).data("pizzaId"));
    });
  
 
    // when modal is hide
    $('#pizzaExtra').on('hide.bs.modal', function (e) {
       
        let extraPizza = new Map();
        extraPizza = setEextraPizzaMap();
       initModalParameter(false);
       // init the price
       tempPrice = 0;
       countExtraPizzaChoose = 0;
    })


    // Remove or add 1 to input text of the pizzaId
    function changePizzaAmount(id, btnType, cost, type){

        let amount = parseInt($(`#${id}`).text());

        if(btnType === 'add'){               
            amount++;
        }           
        else {
            if(amount > 0){
                amount--;              
            } 
        }

        const hebrewName = document.getElementById(id).getAttribute('data-name');

        if(type === "sauce"){
            
            if(!(amount === 0 && btnType === "remove")){
                saucesChoose(id, hebrewName, btnType);
            }
        }
        else {
            if(type === "drink"){
                drinkChoose({
                    id: id,
                    type: btnType,
                    hebrewName: hebrewName,
                    cost: cost
                });
            }
            else { // pizza reservation
                btnType === 'add' ?  pizzaPrice += cost :  pizzaPrice -= cost; 
                if(amount === 0){
                    const index = allPizzaId.indexOf(id);
                    if (index > -1) {
                        array.splice(index, 1);
                    }
                    
                }
                updateSaucePrice(); // למקרה שהוא משנה הזמנה
                updatePrice();
            }          
    
        } 
        $(`#${id}`).html(amount);
    }

    function changePage(addOrBack){
        addOrBack === 'add' ? pageNumber++ : pageNumber--;

        if(pageNumber === 0){
             document.getElementById("btnBack").classList.add('d-none');
             $('#btn-continue-and-reload').removeClass('justify-content-between');
             $('#btn-continue-and-reload').addClass('justify-content-end');
        }

        displayCurrentPage();

        if(pageNumber === 1){
            
            firstPage();
            secondPage();
        }
        else if(pageNumber === 2){
            updateSaucePrice();
            updatePrice();
            thirdPage();
        }
        else if(pageNumber === 3){
            forthPage();
            if(addOrBack === "back"){
                $("#continueBtn").removeClass("d-none");
                $("#totalToPayText").addClass('d-none');
                // $("#print").addClass('d-none');
            }
        }
        else if(pageNumber === 4){
            summaryOrder();
            $("#continueBtn").addClass("d-none");
        }
     
    }

    // display the cuurent page and hide all the other page
    function displayCurrentPage(){
        let idClasses;
        for (let i = 0; i < screenIds.length; i++){
            idClasses = document.getElementById(screenIds[i]).classList;
            if(i !== pageNumber){
                if(!document.getElementById(screenIds[i]).classList.contains('d-none')){
                    idClasses.add('d-none');                
                }
            }
            else{
                idClasses.remove('d-none');
            }
        }
    }

    function firstPage(){

        // Change the position of the buttons
        document.getElementById('btnBack').classList.remove('d-none');
        $('#btn-continue-and-reload').removeClass('justify-content-end');
        $('#btn-continue-and-reload').addClass('justify-content-between');

        bigPizza = parseInt($("#bigPizza").text());    
        famillyPizza = parseInt($("#famillyPizza").text());    
        smallPizza = parseInt($("#smallPizza").text());         
    }

    function secondPage(){
        
        let AppendPizzaHTML;
        let id;
        
        $("#bigPizzaSummary").html('');
        $("#famillyPizzaSummary").html(''); 
        $("#smallPizzaSummary").html('');
        
        if(bigPizza){
            $("#bigPizzaSummary").append("<h3 class='text-right'>פיצה ענקית:</h3>");
            for(let i = 0; i < bigPizza; i++){
                id = `bigpizza${i}`;
                AppendPizzaHTML = returnAppendPizzaHTML(id, i + 1);
                
                $("#bigPizzaSummary").append(AppendPizzaHTML);
                if(allPizzaId.includes(id) === false){
                    allPizzaId.push(id);
                }
                
            } // init the html
        }
        
        if(famillyPizza){
            $("#famillyPizzaSummary").append("<h3 class='text-right'>פיצה משפחתית:</h3>");
            
            for(let i = 0; i < famillyPizza; i++){
                id = `famillypizza${i}`;
                AppendPizzaHTML = returnAppendPizzaHTML(id, i + 1);
                
                $("#famillyPizzaSummary").append(AppendPizzaHTML)
                if(allPizzaId.includes(id) === false){
                    allPizzaId.push(id);
                }
            }
        }
        
        if(smallPizza){
            $("#smallPizzaSummary").append("<h3 class='text-right'>פיצה אישית:</h3>");
            
            for(let i = 0; i < smallPizza; i++){
                id = `smallpizza${i}`;
                AppendPizzaHTML = returnAppendPizzaHTML(id, i + 1);
                
                $("#smallPizzaSummary").append(AppendPizzaHTML)
                if(allPizzaId.includes(id) === false){
                    allPizzaId.push(id);
                }
            }
        }
                     
    }

    // return html choosen pizza
    function returnAppendPizzaHTML(id, index){

        let cssStyle = "", 
            extraPizzaText = ` לחץ להוספת תוספת לפיצה מספר ${index}`; 
        allextraPizzaChoose.forEach(ex =>{
            if(id === ex.pizzaId){
                extraPizzaText = "נבחרו תוספות עבור הפיצה";
                cssStyle = "text-primary"
            }
        })
        
        return `<p class="text-right btn w-100 pr-0 append-pizza-modal ${cssStyle}" data-toggle="modal" data-target="#pizzaExtra" data-pizza-id="${id}"> ${extraPizzaText}</p>`;
    }

    // sauce page
    function thirdPage(){


    }
    
    // drink page
    function forthPage(){

    }

    // בדיקה האם נלחץ על חצי מגש או מגש שלם
    function quantityOnPizza(){
        let imageChecked = 0;
        const list = document.querySelectorAll('.quantity-extra-pizza');

        list.forEach(el =>{
            if(el.classList.contains('image-checkbox-checked')){
                imageChecked++;
            }
        });

        if(imageChecked === 2 || imageChecked === 0){
            errorsList.quantity = true;
            $("#saveExtraPizza").attr("disabled", true);
            $("#whole-or-half-pizza-message-error").removeClass('d-none');
        }
        else if(imageChecked === 1){
            errorsList.quantity = false;
            if(errorsList.extraPizza === false){
                $("#saveExtraPizza").attr("disabled", false);
            }
            $("#whole-or-half-pizza-message-error").addClass('d-none');
        }
      
    }

    $(".extra-pizza").click(function(ev) {
     
        const extraId = $(this).data("id");
        if(extraId !== "extraCheese"){
            if(this.className.includes("image-checkbox-checked")){
                countExtraPizzaChoose--;
    
            } else {
                countExtraPizzaChoose++;
            }
        }
            
        // בדיקה אם נבחר יותר משתי תוספות
        if(countExtraPizzaChoose > 2) { // to much
            errorsList.extraPizza = true;
            
            $('#extra-pizza-message-error').removeClass('d-none');
            $("#saveExtraPizza").attr("disabled", true);
        }

        else if($('#extra-pizza-message-error').hasClass('d-none') === false){
            errorsList.extraPizza = false;
                $('#extra-pizza-message-error').addClass('d-none');
                if(errorsList.quantity === false){
                    $("#saveExtraPizza").attr("disabled", false);
                }
        }
       
    });



    function drinkChoose(drink){

        const index = checkIfDrinkExist(drink.id);

        if (index !== false){ // I need to update the row

            if(drink.type === "add") {
                drinksChoose[index].amount++
            } 
            else{
                drinksChoose[index].amount === 1 ? drinksChoose.splice(index, 1) : drinksChoose[index].amount--;
            }
        }
        else { // If not exist I need to add him
            drinksChoose.push({
                id: drink.id,
                hebrewName: drink.hebrewName,
                amount: 1,
                cost: drink.cost
            });
        }
        drinksPrice = calcPriceOfDrinksChoose(drinksChoose);
        updatePrice()

    }

    function calcPriceOfDrinksChoose(drinksChoose){
        let total = 0;
        drinksChoose.forEach(drink => {
            total += drink.cost * drink.amount;
        })
        return total;
    }

    // Return the index of the drink
    function checkIfDrinkExist(drinkId){
        let indexOfDrink = false;
        drinksChoose.forEach((drink, index) =>{
            if(drink.id === drinkId){
                indexOfDrink = index;
            }
        });
        return indexOfDrink;
    }

    function summaryOrder(){
        $("#totalToPayText").removeClass("d-none");
        // $("#print").removeClass('d-none');
        $("#priceToPayModal").html($("#price").text());

        // drinks choose
        if(drinksChoose.length > 0){
            $("#drinkSummary").removeClass('d-none');
            $("#drinkSummary").html("");
            drinksChoose.forEach(drink =>{
                $("#drinkSummary").append(`<p>${drink.hebrewName} כמות:${drink.amount}</p>`);
            });
        }
        if(sauceChoose.length > 0){
            $("#saucesSummary").removeClass('d-none');
            $("#saucesSummary").html("");
            sauceChoose.forEach(sauce =>{
                $("#saucesSummary").append(`<p>
                <span>סוג רוטב: ${sauce.sauceHebrewName}</span><br/>
                <span>כמות רוטב: ${sauce.amount}</span>
                </p>`);
            })
        }

        if(allPizzaId.length > 0){
            $("#pizzaSummaryOrder").html("");
            allPizzaId.forEach(pizzaId =>{

                let isExtraPizzaId = returnExtraPizza(pizzaId);
                let pizzaSize = returnPizzaSize(pizzaId);

                let node = document.createElement("div");
                node.className = "font-weight-bold mt-2";
                let divPizzaSize = document.createTextNode(`${pizzaSize}`);
                node.appendChild(divPizzaSize);
                document.getElementById("pizzaSummaryOrder").appendChild(node);



                if(isExtraPizzaId !== false){ // the pizza has extra

                    // תוסםת על מגש שלם או חצי מגש
                    let divHowMuch = document.createElement("div");

                    divHowMuch.className = "col-12 pr-0";
                    let txtHowMuch = document.createTextNode(`- תוספת על: ${isExtraPizzaId["howMuch"]}`);
                    divHowMuch.appendChild(txtHowMuch);
                    document.getElementById("pizzaSummaryOrder").appendChild(divHowMuch);
                    
                    // הוספת התוספות לפיצה
                    let nodeExtraChoose = document.createElement("div");
                    let spanDivPizzaExtra = "- תוספות לפיצה:";

                    isExtraPizzaId["extraPizzaChecked"].forEach(ex => {
                        spanDivPizzaExtra += ` ${ex}, `;
                    }); 
                    //remove the , and the space
                    spanDivPizzaExtra = spanDivPizzaExtra.substring(0, spanDivPizzaExtra.length - 2);

                    let divPizzaExtra = document.createTextNode(spanDivPizzaExtra);

                    nodeExtraChoose.appendChild(divPizzaExtra);
                    document.getElementById("pizzaSummaryOrder").appendChild(divPizzaExtra);

                    // COMMENT
                    if(isExtraPizzaId["comment"] !== ""){
                        let nodeComment = document.createElement("div");
                        nodeComment.className = "mb-2";
                        let divNodeComment = document.createTextNode(` הערה: ${isExtraPizzaId["comment"]}`);
                        nodeComment.appendChild(divNodeComment);
                        document.getElementById("pizzaSummaryOrder").appendChild(nodeComment);
                    }
                                   
                }

                else { //the pizza doesn't has extra
                    $("#pizzaSummaryOrder").append(`<span class="mr-1 ">- ללא תוספות</span>`);
                }
            });
        }

        // connect to payment method
        connect();
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
            document.getElementById('comment').value = allextraPizzaChoose[isExist].comment;
            
            allextraPizzaChoose[isExist].howMuch === "חצי מגש"?
                document.getElementById('halfPizza').parentNode.classList.add("image-checkbox-checked"):
                document.getElementById('wholePizza').parentNode.classList.add("image-checkbox-checked");
                $("#whole-or-half-pizza-message-error").addClass('d-none');
                $("#saveExtraPizza").attr("disabled", false);

                // init the countExtraPizzaChoose
                countExtraPizzaChoose = allextraPizzaChoose[isExist].extraPizzaCheckedId.length;
                if(allextraPizzaChoose[isExist].extraPizzaCheckedId.includes("extraCheese")){
                    countExtraPizzaChoose--;
                }
        }

        document.getElementById('pizzaExtra').setAttribute('data-pizza-id', pizzaId);
        $("#extraPizzaCost").html("");

        if(pizzaId.includes("big")){
            $("#extraPizzaCost").append(`
            מחיר תוספת 7 ש"ח לתוספת אחת על כל המגש, או 2 תוספות על חצי מגש,
             תוספת גבינה מחירה 8 ש"ח`);
        }
        else if(pizzaId.includes("small")){
            $("#extraPizzaCost").append(`
            מחיר תוספת 2 ש"ח לתוספת אחת על כל המגש, או 2 תוספות על חצי מגש, תוספת גבינה מחירה 3 ש"ח`);
        }
        else{
            $("#extraPizzaCost").append(`
            מחיר תוספת 5 ש"ח לתוספת אחת על כל המגש, או 2 תוספות על חצי מגש, תוספת גבינה מחירה 6 ש"ח`);
        }

    }


    // init the extra pizza that was choose
    function initTheExtraPizza(extraPizzaCheckedId){

        extraPizzaCheckedId.forEach(el => {
            let img = document.getElementById(el);
            img.parentNode.classList.add("image-checkbox-checked");
         

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

        countExtraPizzaChoose = 0; // איפוס התוספות שנבחרו
        const pizzaId = document.getElementById('pizzaExtra').getAttribute('data-pizza-id');
        
        let extraPizzaChecked = new extraPizzaChoose(pizzaId);
        let extraPizzaCheckedId = [];
        let extraPizza = new Map();
        extraPizza = setEextraPizzaMap();

        let cat = document.querySelectorAll('.extra-pizza');
        cat.forEach((item) =>{
            let classes = item.className;
            let html = item.innerHTML;

            let isChecked = classes.includes("image-checkbox-checked");

            if(isChecked){
                if(html.includes("tomato")){
                    extraPizzaChecked.tomato = true;
                    extraPizzaCheckedId.push("tomato");
                }
                else if(html.includes("onion")){
                    extraPizzaChecked.onion = true;
                    extraPizzaCheckedId.push("onion");
                }
                else if(html.includes("machroom")){
                    extraPizzaChecked.machroom = true;
                    extraPizzaCheckedId.push("machroom");
                }
                else if(html.includes("corn")){
                    extraPizzaChecked.corn = true;
                    extraPizzaCheckedId.push("corn");
                }
                else if(html.includes("extraCheese")){
                    extraPizzaChecked.extraCheese = true;
                    extraPizzaCheckedId.push("extraCheese");
                }
                else if(html.includes("greenOlive")){
                    extraPizzaChecked.greenOlive = true;
                    extraPizzaCheckedId.push("greenOlive");
                }
                else{
                    extraPizzaChecked.blackOlive = true;
                    extraPizzaCheckedId.push("blackOlive");
                }
            }
        });

        let obj = {};
        const isHalf = document.getElementById('halfPizza').parentNode.classList.contains('image-checkbox-checked');
        isHalf ? obj["howMuch"] = "חצי מגש" : obj["howMuch"] = "מגש שלם";
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
        
        if(isExist === false) {
            allextraPizzaChoose.push(obj);          
        }  
        else {
            allextraPizzaChoose[isExist] = obj;
            // חישוב מחיר חדש אם המוכר בחר מגש שלם ועכשיו הוא בחר בחצי מגש
        }

        // חישוב מחיר התוספות לפיצה מחדש
        extraPizzaPrice = 0;
        allextraPizzaChoose.forEach((extra, index) =>{
            extraPizzaPrice += calcExtraPizzaCost(extra);
        });

        updatePrice();
        initModalParameter(true); 

        //change the text of the pizza
        let p = document.querySelectorAll('.append-pizza-modal');
        p.forEach(el =>{
            if(el.getAttribute('data-pizza-id') === obj["pizzaId"]){
                el.innerHTML = "נבחרו תוספות עבור הפיצה";
                el.classList.add("text-primary");            
            }
        });    
    });

    // receive the pizza object and return the price of the extra pizza
    function calcExtraPizzaCost(arrExtraPizza){

        let extraCheezePrice = 0;
        let totalPrice = 0;

        arrExtraPizza.extraPizzaCheckedId.forEach(el =>{
            let price = PriceOfExtraPizza(arrExtraPizza.pizzaId, el);
            el === "extraCheese" ? extraCheezePrice = price : totalPrice += price;
        });

        arrExtraPizza.howMuch === "מגש שלם" ? totalPrice += extraCheezePrice : totalPrice = totalPrice / 2 + extraCheezePrice;

        return totalPrice;
    }

    // receive an extra pizza and return the price
    function PriceOfExtraPizza(pizzaId, el){

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

    // ביטול כל התוספות שנבחרו לפיצה
    function initModalParameter(hideModal){
        if(hideModal === true)
            $('#pizzaExtra').modal('hide');
        
        let cat = document.querySelectorAll('.image-checkbox');
        cat.forEach((item) =>{
            item.classList.remove('image-checkbox-checked');
        });
       
        $("#comment").val("");
        // errors list
        errorsList.quantity = true;
        errorsList.extraPizza = false;
        $("#saveExtraPizza").attr("disabled", true);
        $("#whole-or-half-pizza-message-error").removeClass('d-none');
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

        updateSaucePrice();
        updatePrice();
    }

    function updateSaucePrice(){
        let amountSauce = 0;
        sauceChoose.map(sauce => amountSauce += parseInt(sauce.amount)); 

        // על כל מגש משפחתי מגיע תוספת חינם
       amountSauce > allPizzaId.length ?
           saucePrice = (amountSauce - allPizzaId.length) * 2 : 
           saucePrice = 0;
    }

    // if the sauce exist return the index else return false
    function sauceExist(id){
        for(let i = 0; i < sauceChoose.length; i++){
            if(sauceChoose[i].id === id)
                return i;
        }
        return false;
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

//     function printData(){
   
//         const summaryOrder = document.getElementById("orderSummary").innerHTML;
//         var mywindow = window.open('', 'PRINT', 'height=400,width=600');

//         mywindow.document.write('<html><head><title>' + document.title  + '</title>');
//         mywindow.document.write(`<style>
//         * {
//             font-size: 14px;
//             /* margin: 0 !important; */
//             text-align: center;
//                align-content: center;
//         }
//         #orderSummary{
//             width: 155px;
//             max-width: 155px;
//         }
//         #pizzaSummaryOrder, 
//         #drinkSummary, 
//         #saucesSummary{
//             border-bottom: 1px solid black;
//         }
//         .font-weight-bold {
//             font-weight: 700!important;
//         }
//         .mt-2 {
//             margin-top: .5rem!important;
//         }</style>`)
//         mywindow.document.write('</head><body dir="rtl">');
        
//         mywindow.document.write(summaryOrder);
//         let totalPrice = document.getElementById("price").innerHTML;
//         let priceDesc = `<div style="text-decoration: underline">סה"כ ${totalPrice} ש"ח</div>`
//         mywindow.document.write(priceDesc);
//         mywindow.document.write(`<div style="margin-bottom: 20px; font-size:12px">תודה שקניתם בפיצה מקס :)</div>`);
//         mywindow.document.write(`<p>&nbsp;&nbsp;&nbsp;</p>`);
//         mywindow.document.write(`<p>-------------------</p>`);

//         mywindow.document.write(`</body><script>
//         window.onafterprint = function(){window.close()}
//         </script></script></html>`);

//         mywindow.document.close(); // necessary for IE >= 10
//         mywindow.focus(); // necessary for IE >= 10*/

//         mywindow.print();

//   }

    // image gallery
// init the state from the input
$(".image-checkbox").each(function () {
    if ($(this).find('input[type="checkbox"]').first().attr("checked")){
      $(this).addClass('image-checkbox-checked');
    }
    else {
      $(this).removeClass('image-checkbox-checked');
    }
  });
  
  // sync the state to the input
  $(".image-checkbox").on("click", function (e) {
    const id = e.target.id;
    if(id === "halfPizza" || id === "wholePizza")
        removeWholeOrHalfPizzaChecked(); 

    $(this).toggleClass('image-checkbox-checked');
    var $checkbox = $(this).find('input[type="checkbox"]');
    $checkbox.prop("checked",!$checkbox.prop("checked"));
    // בדיקה אם נבחר חצי או פיצה שלמה
    quantityOnPizza();
    
    e.preventDefault();
  });

  // toggle class between whole and half pizza 
  function removeWholeOrHalfPizzaChecked(){ 
    const list = document.querySelectorAll('.quantity-extra-pizza');

    list.forEach(el =>{
        el.classList.remove('image-checkbox-checked');
    });
  }

  function updatePrice(){
    $("#price").html(pizzaPrice + extraPizzaPrice + saucePrice + drinksPrice);
  }
  function initBridge() {
    if (typeof (CefSharp) != "undefined") {
        CefSharp.BindObjectAsync("boundAsync", "bound");
        console.log('Is ready!');
        boundAsync.isready();
        log('Starting the application');
    }
  }
  $(window).load(function() {
    initBridge();
  });

 
                // swal("תודה שקניתם בפיצה מקס!",
                //  "ההזמנה תאותחל עוד 3 שניות...");

            
               
