
{


////////////////////// handlebars function
// pizza reservation
let content = document.getElementById("pizzaReservation");
let source   = document.getElementById("handlebars-pizza-reservation").innerHTML;
let template = Handlebars.compile(source);

let pizza = returnPizzaObject();
var context = {pizza: pizza};
var html    = template(context);
content.innerHTML = html;


//sauce reservation
content = document.getElementById("sauce");
source   = document.getElementById("handlebars-sauce-reservation").innerHTML;
template = Handlebars.compile(source);
let sauce = returnSauceObject();

context = {sauce: sauce};
html    = template(context);
content.innerHTML = html;



// init object
function returnSauceObject (){
    return [
        {
            "imgPath": "sauceThousandIslandDressing.jpg",
            "sauceHebrewName": "אלף האיים",
            "id": "sauceThousandIslandDressing",
            "cost": 2
        },
        {
            "imgPath": "sauceGarlic.jpg",
            "sauceHebrewName": "שום",
            "id": "sauceGarlic",
            "cost": 2
        },
        {
            "imgPath": "pizzaSauce.jpg",
            "sauceHebrewName": "רוטב פיצה",
            "id": "pizzaSauce",
            "cost": 2
        }
    ];
}


 function returnPizzaObject(){
    let pizza = [
        {
            "pizzaDescription": "פיצה ענקית (8 משולשים)",
            "cost": "35",
            "id": "bigPizza"
        },
        {
            "pizzaDescription": "פיצה משפחתית (6 משולשים)",
            "cost": "30",
            "id": "famillyPizza"
        },
        {
            "pizzaDescription": "פיצה אישית (4 משולשים)",
            "cost": "20",
            "id": "smallPizza"
        }
    ]
    return pizza;
 } 
}



/*
let drinks = [
    {
        "hebrewDescription": `פחית 6 ש"ח`,
        "drinkArr": [
            {
                "id":"",
                "imgPath":"colaTin.jpg",
                "cost": 6 ,
                "drinkHebrewName": ""
            }
        ]
        
    },
    {
        "id":"",
        "imgPath":"",
        "cost": ,
        "drinkHebrewName":"",
        "hebrewDescription":
    },
    {
        "id":"",
        "imgPath":"",
        "cost": ,
        "drinkHebrewName":"",
        "hebrewDescription":
    },
    {
        "id":"",
        "imgPath":"",
        "cost": ,
        "drinkHebrewName": "",
        "hebrewDescription":
    },
    {
        "id":"",
        "imgPath":"",
        "cost": ,
        "drinkHebrewName": "",
        "hebrewDescription":
    },
    {
        "id":"",
        "imgPath":"",
        "cost": ,
        "drinkHebrewName": "",
        "hebrewDescription":
    }
]
*/