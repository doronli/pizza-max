
    
    var ws ;
    var priceToPay;
    var arrTubeStatus; // רשימת המטבעות שאפשר להחזיר בעודף



    function connect() {
      
        priceToPay = $("#price").text();
        priceToPay = parseFloat(priceToPay);
        boundAsync.startPayProcess(priceToPay * 100);
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
    
  
        

    function printData(){
   
        const summaryOrder = document.getElementById("orderSummary").innerHTML;
        var mywindow = window.open('','','width=600,height=400');

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

        mywindow.focus(); // necessary for IE >= 10*/
        
        mywindow.print();
        mywindow.document.close(); // necessary for IE >= 10

  }