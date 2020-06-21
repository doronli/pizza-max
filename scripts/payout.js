
    
    var ws ;
    var priceToPay;
    var arrTubeStatus; // רשימת המטבעות שאפשר להחזיר בעודף



    function connect() {
        ws = new WebSocket("ws://localhost:3001/echo");

        ws.onopen = function () {
            acceptCoins();
            acceptBills();

            priceToPay = parseFloat($("#price").text());
            console.log(priceToPay);
        };

        ws.onmessage = function (event) {

            const obj = JSON.parse(event.data);

            if(obj.Name === "onGettingTubeStatus"){ // שליחת פירוט המטבעות הקיימות במערכת בעת התחברות למערכת
                const coinListInMachine = obj.Value
            }

            else if(obj.Name === "coinChnagerSetup"){ // רשימת המטבעות בתוך המכונה
                const arrCoinsList = obj.Value.CoinsList;
                const arrTubesList = obj.Value.TubesList;
                console.log(arrCoinsList, arrTubesList);
            }

            else if(obj.Name === "billAcceptorSetup") { // רשימת השטרות במערכת 
                const arrBillsList = obj.Value.BillsType
            }

            else if(obj.Name === "tubeStatus") { // רשימת כל המטבעות בתוך המכונה עם פירוט של כמות
                arrTubeStatus = obj.Value;
            }

            else if(obj.Name === "coinDeposited") { // נכנס מטבע למכונה 
                const objCoinInserted = obj.Value;
                const coinValue = objCoinInserted.billValue / 100;
                calcPriceToPay(coinValue);
            }

            else if(obj.Name === "billDeposited") { // נכנס שטר למכונה
                const objBillInserted = obj.Value;
                const billValue = objBillInserted.billValue / 100;
                calcPriceToPay(coinValue);
            }


            
            
            console.log('message from Server', obj);
        
        };

        
        ws.onclose = function (e) {
            console.log('Socket is closed. Reconnect will be attempted in 1 second.', e.reason);
            setTimeout(function () {
                connect();
            }, 1000);
        };

        ws.onerror = function (err) {
            console.error('Socket encountered error: ', err.message, 'Closing socket');
            ws.close();
        };


    }

    function calcPriceToPay(payment){ // כאשר נכנס שטר או מטבע חישוב כמה נשאר עוד לשלם
        priceToPay -= payment;
        $("#price").html(priceToPay);
        
        if(priceToPay === 0){
            printAndReload();
        }
        else if(priceToPay < 0){
            payout(Math.abs(priceToPay));
            printAndReload();
            
        }
    }

    function printAndReload(){
        printData();
        
        swal({
            title: "תודה שקניתם בפיצה מקס!",
            text: "ההזמנה תאותחל עוד 3 שניות...",
            icon: "success",
            button: "תודה ובתאבון",
          });

        setTimeout(() => {
            location.reload();
        }, 3000);
    }

    

    function payout(amountToPayout) {
    
        ws.send( JSON.stringify({ name: 'payout', value: amountToPayout*100 }));
    }
    
    function acceptCoins(){ // קבלת כסף ממכונת המטבעות
        ws.send( JSON.stringify({ name: 'acceptCoins', value:[true,false,true,true,true,true] }));
    }
    
    function acceptBills(){ // קבלת כסף ממכונת השטרות
        // first 4 arguments represents bills. the last one it's for escrew option
        ws.send( JSON.stringify({ name: 'acceptBills', value:[true,false,true,true,true] }));
    }
        

    function printData(){
   
        const summaryOrder = document.getElementById("orderSummary").innerHTML;
        var mywindow = window.open('', 'PRINT', 'height=400,width=600');

        // mywindow.document.write('<html><head><title>' + document.title  + '</title>');
        mywindow.document.write(`<style>
        * {
            font-size: 14px;
            /* margin: 0 !important; */
            text-align: center;
               align-content: center;
        }
        #orderSummary{
            width: 155px;
            max-width: 155px;
        }
        #pizzaSummaryOrder, 
        #drinkSummary, 
        #saucesSummary{
            border-bottom: 1px solid black;
        }
        .font-weight-bold {
            font-weight: 700!important;
        }
        .mt-2 {
            margin-top: .5rem!important;
        }</style>`)
        mywindow.document.write('</head><body dir="rtl">');
        
        mywindow.document.write(summaryOrder);
        let totalPrice = document.getElementById("price").innerHTML;
        let priceDesc = `<div style="text-decoration: underline">סה"כ ${totalPrice} ש"ח</div>`
        mywindow.document.write(priceDesc);
        mywindow.document.write(`<div style="margin-bottom: 20px; font-size:12px">תודה שקניתם בפיצה מקס :)</div>`);
        mywindow.document.write(`<p>&nbsp;&nbsp;&nbsp;</p>`);
        mywindow.document.write(`<p>-------------------</p>`);

        mywindow.document.write(`</body><script>
        window.onafterprint = function(){window.close()}
        </script></script></html>`);

        mywindow.document.close(); // necessary for IE >= 10
        mywindow.focus(); // necessary for IE >= 10*/

        mywindow.print();

  }