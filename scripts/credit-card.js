
function readCard() {

    document.getElementById('swiped').focus();
    
    
}

$("#swiped").change(() =>{
    const val = $("#swiped").val();
    init(val);
});

function init(value){
    var card_data = value;

var details1 = card_data.split("^");

var card_number = details1[0];
card_number = card_number.substring(2);

var names = details1[1].split("/");
var first_name = names[1];
var last_name = names[0];

var details2 = details1[2].split(";");
details2 = details2[1].split("=");

var exp_date = details2[1];
exp_date = exp_date.substring(0, exp_date.length - 1);
exp_date = exp_date.substring(2, 3) + "/" + exp_date.substring(0,1);

document.getElementById("first_name").value = first_name;
document.getElementById("last_name").value = last_name;
document.getElementById("card").value = card_number;
document.getElementById("expiry").value = exp_date;

console.log(card_number);
console.log(first_name);
console.log(last_name);
console.log(exp_date);
}


/*

let data = {
  "Customer": {
    "CompanyNumber": null,
    "ExternalIdentifier": null,
    "NoVAT": null,
    "SearchMode": 0,
    "Name": "Danny Dean",
    "Phone": 0547389772,
    "EmailAddress": null,
    "City": "ashdod",
    "Address": null,
    "ZipCode": null,
    "ID": null,
    "Folder": null
  },
  "PaymentMethod": {
    "ID": null,
    "CustomerID": null,
    "CreditCard_Number": "130002070",
    "CreditCard_LastDigits": null,
    "CreditCard_ExpirationMonth": 12,
    "CreditCard_ExpirationYear": 2020,
    "CreditCard_CVV": "123",
    "CreditCard_Track2": null,
    "CreditCard_CitizenID": "123456789",
    "CreditCard_CardMask": null,
    "CreditCard_Token": null,
    "Type": 1
  },
  "SingleUseToken": null,
  "CreditCardAuthNumber": null,
  "Items": [
    {
      "Item": {
        "ID": null,
        "Name": "My Product",
        "Price": null,
        "Currency": null,
        "Cost": null,
        "ExternalIdentifier": null,
        "SearchMode": null
      },
      "Quantity": 2,
      "UnitPrice": 50,
      "Currency": null,
      "Description": null,
      "UseItemDetails": null
    }
  ],
  "Payments_Count": null,
  "Payments_FirstAmount": null,
  "Payments_NonFirstAmount": null,
  "UpdateCustomerByEmail": null,
  "UpdateCustomerByEmail_AttachDocument": null,
  "UpdateCustomerByEmail_Language": null,
  "SendDocumentByEmail": true,
  "SendDocumentByEmail_Language": null,
  "DocumentLanguage": null,
  "DocumentDescription": null,
  "VATIncluded": true,
  "VATRate": null,
  "AuthoriseOnly": null,
  "DraftDocument": null,
  "DocumentType": null,
  "SupportCredit": null,
  "MerchantNumber": null,
  "SendCopyToOrganization": null,
  "Credentials": {
    "CompanyID": 12345678,
    "APIKey": "881prb6OG24bGiT3O311iK09lUt8ve9IfJ3kK4uEYvQUJtQFNs"
  },
  "ResponseLanguage": null
};


$.ajax({
  type: "POST",
  url: "https://www.myofficeguy.com/api/billing/payments/charge/",
  data: data,
  success: function(data){

  },
  dataType: dataType
});
*/