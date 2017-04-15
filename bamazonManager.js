//Required packages
var mysql = require("mysql");
var inquirer = require("inquirer");

//Establish connection with databse
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "z1qatgb5",
  database: "bamazon"
});
connection.connect(function(err) {
  if (err) throw err;   
});

//Declare all functions for use in app
var displayItems = function () {
  var query = "SELECT item_id, product_name, price, department_name, stock_quantity FROM products"; ///pagination
    //Query to display items 
    connection.query(query, function(err, answers) {   
      for (var i = 0; i < answers.length; i++){
        var item = answers[i].item_id;
        var product = answers[i].product_name;
        var price = answers[i].price;
        var depart=answers[i].department_name;
        var stock=answers[i].stock_quantity;
        if(err){console.log(err);}
        console.log("\n" + product + "\n " + "Department: " + depart + "\n " + "ID #: " + item + "\n " 
          +  "Price: $" + price + "\n " + "Stock: " + stock);     
      }
    });        
};

var lowStock = function() {
  var query = "SELECT item_id, product_name, price, department_name, stock_quantity FROM products";
    connection.query(query , function (err, answers) { 
      for (var i = 0; i < answers.length; i++){
        var item = answers[i].item_id;
        var product = answers[i].product_name;
        var price = answers[i].price;
        var depart=answers[i].department_name;
        var stock=answers[i].stock_quantity;
        if (stock < 5){
          if(err){console.log(err);}
          console.log("\n" + product + "\n " + "Department: " + depart + "\n " + "ID #: " + item + 
          "\n " +  "Price: $" + price + "\n " + "Stock: " + stock);
        }     
      }
    });        
};
            
var updateStock = function(){
  inquirer.prompt([
    { name: "id",
      type: "input",
      message: "Please select the ID # of the item you would like to update: "
    },

    { name: "stock",
      type: "input",
      message: "Input the amount of stock you would like to add:",
    }
  ]).then(function(answer) {  
      var id = answer.id;
      var addAmount = answer.stock;
      // Run query to retrieve the stock quantity of item selected
      connection.query("SELECT stock_quantity, product_name FROM products WHERE item_id=" + id, function (err, res) { 
        var stockAmount = res[0].stock_quantity;      
        var newStock = parseFloat(stockAmount) + parseFloat(addAmount);
        //Update selected stock based on user input
        connection.query("UPDATE products SET stock_quantity=" + newStock + " WHERE item_id=" + id , function (err, res) { 
          console.log("Stock has been updated. The new amount of stock is: " + newStock);
        });         
      }); 
    });  
}

var newProduct = function(){
  inquirer.prompt([
    { name: "name",
      type: "input",
      message: "Enter the name of the new product:",
    },

    { name: "department",
      type: "input",
      message: "Enter the department of the new product:",
    },

    { name: "price",
      type: "input",
      message: "Enter the price of the new product:",
    },
    
    { name: "stock",
      type: "input",
      message: "Enter the amount of the new product:",
    },
  ]).then(function(answer) {
      var name = answer.name;
      var dept = answer.department;
      var price = answer.price;
      var stock = answer.stock;
      var post = {product_name: name, department_name: dept, price: price, stock_quantity: stock }
      // Run query to insert user data to table and console log information.
      connection.query("INSERT INTO products SET ?", post , function (err, res) { 
        if (err) throw err;
        console.log("\n" + "Product: " + name + "\n " + "ID#: " + res.insertId + "\n " + "Department: " + dept +
          "\n "  +  "Price: $" + price + "\n " + stock );
      });
    });
}

//Run app using switch case
inquirer.prompt([
  { name: "manager",
    type: "list",
    message: "Please select from the following:",
    choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
  }
  ]).then(function(answer) {
    var selection = answer.manager;
    switch(selection) {
      case "View Products for Sale":
        displayItems();
        break;
      case "View Low Inventory":
        lowStock();
        break;
      case "Add to Inventory":
        displayItems();
        updateStock();
        break;
      case "Add New Product":
        newProduct();
        break;
      default: "View Products for Sale";
    };   
});