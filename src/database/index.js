var Connection = require('tedious').Connection;

var config = {
    userName: 'yourusername',
    password: 'yourpassword',
    server: 'yourserver.database.windows.net',
    // If you are on Azure SQL Database, you need these next options.  
    options: { encrypt: true, database: 'AdventureWorks' }
};

var connection = new Connection(config);

connection.on('connect', function(err) {
    // If no error, then good to proceed.  
    console.log("Connected");

    //ejecutor statements
    executeStatement1();
});

/*
en index.js


    recibo conection sql de sqlCLient.js


*/

var Request = require('tedious').Request
var TYPES = require('tedious').TYPES;

function executeStatement1() {
    request = new Request("INSERT SalesLT.Product (Name, ProductNumber, StandardCost, ListPrice, SellStartDate) OUTPUT INSERTED.ProductID VALUES (@Name, @Number, @Cost, @Price, CURRENT_TIMESTAMP);", function(err) {
        if (err) {
            console.log(err);
        }
    });
    request.addParameter('Name', TYPES.NVarChar, 'SQL Server Express 2014');
    request.addParameter('Number', TYPES.NVarChar, 'SQLEXPRESS2014');
    request.addParameter('Cost', TYPES.Int, 11);
    request.addParameter('Price', TYPES.Int, 11);
    request.on('row', function(columns) {
        columns.forEach(function(column) {
            if (column.value === null) {
                console.log('NULL');
            } else {
                console.log("Product id of inserted item is " + column.value);
            }
        });
    });

    connection.execSql(request);
}