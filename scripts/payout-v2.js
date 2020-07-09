var ws;
var priceToPay;
var arrTubeStatus; // רשימת המטבעות שאפשר להחזיר בעודף

function connect() {
  priceToPay = $("#price").text();
  priceToPay = parseFloat(priceToPay);
  boundAsync.startPayProcess(priceToPay * 100);
//   boundAsync.startPayProcess(priceToPay * 100);
}

function calcPriceToPay(payment) {
  // appear to user how much money left to pay

  if(payment < priceToPay){
      $("#price").html(priceToPay - payment);
  }
  else {
    $("#price").html(0);
    printAndReload();
  }
}

// inserted coin function
function updateAmountPaid(currentAmount, change, insertedCoinsBills) {
  /*
    currentAmount - sum of the inserted coins in agorot
    insertedCoinsBills - array of json of insted coin {qnt: 1 ,value: 500}
    change - if 'change' is undfined, the payin process not finished yet
  */
  console.log("** updateAmountPaid **");
  console.log(`currentAmount: ${currentAmount} `);

  if (change == undefined) {
    console.log("Not finished yet");
  } else {
    console.log("Paying is finshed. change: " + change);
    returnChange(change);
  }
  calcPriceToPay(currentAmount / 100);
}

// החזרת עודף ללקוח
function returnChange(amount) {
  console.log("returnChange: " + amount);
  boundAsync.returnChange(amount);
}

// refund the amount since last "startPayProcess" function
function cancelPayingProcess() {
  boundAsync.cancelPayingProcess(0);
}

// error when you Spending money from a machine
function payoutError(amount) {

}

// Shows how much money was left over
function updatePayout(paidAmountInAgorot, remainsAmountInAgorot, coins) {
  //  int, int, json
  console.log("** start update payout function **");
  console.log(`paidAmountInAgorot : ${paidAmountInAgorot}`);
  console.log(`remainsAmountInAgorot : ${remainsAmountInAgorot}`);
  console.log(`coins : ${coins}`);
  console.log("** end update payout function **");

}

function log(text) {
  console.log(text);
  if (typeof boundAsync != "undefined") {
    if (typeof boundAsync.log === "function") {
      boundAsync.log(text);
    } else {
      console.log('"log" is not a function');
    }
  } else console.log("BOUND IS UNDEFINED");

  console.log(text);
}

// מראה כמה כסף יש בתאי העודף
function updateTubeStatus(json) {
  //TODO: update the server
  console.log("Update tube status");
  console.log(json);
}

// which coin can be insert
function updateCoinBillStatus(json) {
  console.log("updateCoinBillStatus JSON" + JSON.stringify(json));
}

function printAndReload() {
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

function printData() {
  const summaryOrder = document.getElementById("orderSummary").innerHTML;
  var mywindow = window.open("", "", "width=600,height=400");

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
        }</style>`);
  mywindow.document.write('</head><body dir="rtl">');

  mywindow.document.write(summaryOrder);
  let totalPrice = document.getElementById("price").innerHTML;
  let priceDesc = `<div style="text-decoration: underline">סה"כ ${totalPrice} ש"ח</div>`;
  mywindow.document.write(priceDesc);
  mywindow.document.write(
    `<div style="margin-bottom: 20px; font-size:12px">תודה שקניתם בפיצה מקס :)</div>`
  );
  mywindow.document.write(`<p>&nbsp;&nbsp;&nbsp;</p>`);
  mywindow.document.write(`<p>-------------------</p>`);

  mywindow.document.write(`</body><script>
        window.onafterprint = function(){window.close()}
        </script></script></html>`);

  mywindow.focus(); // necessary for IE >= 10*/

  mywindow.print();
  mywindow.document.close(); // necessary for IE >= 10
}
