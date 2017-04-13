var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "z1qatgb5",
  database: "bamazon"
});


connection.connect(function(err) {
  if (err) throw err;
  // runSearch();
   // else { console.log("tacos!")}
   
});


var displayItems = function () {
  var query = "SELECT item_id, product_name, price, department_name FROM products"; ///pagination
    connection.query(query, function(err, answers) {
       
      for (var i = 0; i < answers.length; i++){
        var item = answers[i].item_id;
        var product = answers[i].product_name;
        var price = answers[i].price;
        var depart=answers[i].department_name;

        if(err){console.log(err);}
        console.log("\n" + product + "\n " + "Department: " + depart + "\n " + "ID #: " + item + "\n " +  "Price: $" + price);
        
       
      }
       itemPick();  
    });        
};

var itemPick = function () {
  inquirer.prompt([{
    name: "id",
    type: "input",
    message: "Please select the ID # of the item you would like to purchase: "
    },

    {
    name: "amount",
    type: "input",
    message: "How many would you like?"
    
    },

  ]).then(function(answer) {

      var id = answer.id;

      var amount = answer.amount;

    
      //Run query to retrieve the stock quantity and price of user selection
        connection.query("SELECT stock_quantity, price FROM products WHERE item_id=" + id, function (err, res) { 
          var stockAmount = res[0].stock_quantity;
          var newStock = stockAmount - amount;
          var totalCost = amount * res[0].price;
            if (stockAmount > 0  && newStock >= 0) {
                 console.log("We've got that! You're order has been processed." );
                  console.log("Your total is: $" + totalCost);
              connection.query("UPDATE products SET stock_quantity=" + newStock + " WHERE item_id=" + id , function (err, res) { 
                 
              });
            }
            else if (err) { console.log(err);}

            else if (res){ 
                console.log(" Sorry we are out of stock, please choose another item!");
                itemPick();

            }

            else {}
        });
     
  });


 }

displayItems();


