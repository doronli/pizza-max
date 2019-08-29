
{
    ////////////////////// handlebars function
    // pizza reservation
    let content = document.getElementById("pizzaReservation");
    let source   = document.getElementById("handlebars-pizza-reservation").innerHTML;
    let template = Handlebars.compile(source);

    let pizza = returnPizzaObject();
    let context = {pizza: pizza};
    let html    = template(context);
    content.innerHTML = html;


    //sauce reservation
    content = document.getElementById("sauce");
    source   = document.getElementById("handlebars-sauce-reservation").innerHTML;
    template = Handlebars.compile(source);
    let sauce = returnSauceObject();

    context = {sauce: sauce};
    html    = template(context);
    content.innerHTML = html;

    // extra on pizza 
    content = document.getElementById("modal-extra-pizza");
    source   = document.getElementById("handlebars-extra-pizza").innerHTML;
    template = Handlebars.compile(source);
    let extra = returnExtraPizzaObject();

    context = {extra: extra};
    html    = template(context);
    content.innerHTML = html;

    // Drink option
    content = document.getElementById("drinkOption");
    source   = document.getElementById("handlebars-drink").innerHTML;
    template = Handlebars.compile(source);
    let drinks = returnDrinksObject();

    context = {drinks: drinks};
    html    = template(context);
    content.innerHTML = html;


    // init object
    function returnSauceObject (){
        const sauce = [
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
        return sauce;
    }


    function returnPizzaObject(){
        const pizza = [
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


    function returnExtraPizzaObject(){
        const extra = [
            {
                "id": "tomato",
                "value": "tomato",
                "imagePath": "./img/tomato.jpg"
            },
            {
                "id": "onion",
                "value": "onion",
                "imagePath": "./img/onion.jpg"
            },
            {
                "id": "machroom",
                "value": "machroom",
                "imagePath": "./img/machrom.png"
            },
            {
                "id": "corn",
                "value": "corn",
                "imagePath": "./img/corn.jpg"
            },
            {
                "id": "greenOlive",
                "value": "greenOlive",
                "imagePath": "./img/greenOlive.jpg"
            },
            {
                "id": "extraCheese",
                "value": "extraCheese",
                "imagePath": "./img/extraCheese.jpg"
            }
        
        ];
        return extra;
    }

    function returnDrinksObject(){
        let drinks = [
            {
                "hebrewDescription": `פחית 6 ש"ח`,
                "drinkArr": [
                    {
                        "id":"spriteTin",
                        "imgPath":"spriteTin.jpg",
                        "cost": 6 ,
                        "drinkHebrewName": "פחית ספרייט"
                    },
                    {
                        "id":"colaTin",
                        "imgPath":"colaTin.jpg",
                        "cost": 6 ,
                        "drinkHebrewName": "פחית קולה"
                    }
                ]
            },
            {
                "hebrewDescription": `בקבוק קטן 9 ש"ח`,
                "drinkArr": [
                    {
                        "id":"smallSprite",
                        "imgPath":"smallSprite.jpg",
                        "cost": 9 ,
                        "drinkHebrewName": "בקבוק קטן של ספרייט"
                    },
                    {
                        "id":"smallCola",
                        "imgPath":"smallCola.jpg",
                        "cost": 9 ,
                        "drinkHebrewName": "בקבוק קטן של קולה"
                    }
                ]
            },
            {
                "hebrewDescription": `בקבוק גדול 12 ש"ח`,
                "drinkArr": [
                    {
                        "id":"bigSprite",
                        "imgPath":"bigSprite.jpg",
                        "cost": 12 ,
                        "drinkHebrewName": "בקבוק גדול של ספרייט"
                    },
                    {
                        "id": "bigCola",
                        "imgPath": "bigCola.jpg",
                        "cost": 12 ,
                        "drinkHebrewName": "בקבוק גדול של קולה"
                    }
                ]
            }
        
        ]
        
        return drinks;
    }
}
