//https://www.campusmvp.es/recursos/post/trabajando-con-nodejs-consumiendo-datos-de-MongoDB-y-tambien-desde-SQLServer.aspx
//https://stackoverflow.com/questions/28373838/ms-sql-resource-management-using-bluebird-promises
//https://www.microsoft.com/en-us/sql-server/developer-get-started/node/windows/step/2.html
//https://github.com/tediousjs/tedious/blob/master/examples/minimal.js

const promise = require('bluebird');
const SqlConnection = require("tedious").Connection;
const Request = require("tedious").Request;

function createInsertQuery() {
    // let selectQuery = ""
    //return selectQuery;
    let queryTemp = "INSERT INTO dbo].[events] " +
        "(idVisitaQR, idUsuario, nombresUsuario, emailUsuario, tipoUsuario, motivoVisita, fechaVisita)" +
        "VALUES (@idQR, @idUsuario, @nombresUsuario, @emailUsuario, @tipoUsuario, @motivoVisita, @fechaVisita);";

    request = new Request("INSERT SalesLT.Product (Name, ProductNumber, StandardCost, ListPrice, SellStartDate) OUTPUT INSERTED.ProductID VALUES (@Name, @Number, @Cost, @Price, CURRENT_TIMESTAMP);", function(err) {
        if (err) {
            console.log(err);
        }
    });
    request.addParameter('Name', TYPES.NVarChar, 'SQL Server Express 2014');
    request.addParameter('Number', TYPES.NVarChar, 'SQLEXPRESS2014');
    request.addParameter('Cost', TYPES.Int, 11);
    request.addParameter('Price', TYPES.Int, 11);

    return request;
}

executeQuery(query) {

    let resultEntity = {
        result: {},
        error: null
    };

    return new promise((resolve, reject) => {
        var connection = new SqlConnection(this.config);

        connection.on('connect', function(err) {
            let request = new Request(query, function(err, rowCount, rows) {
                if (err) {
                    resultEntity.error = err;
                    reject(resultEntity);
                } else {
                    resultEntity.result = rows;
                    resolve(resultEntity);
                }

                connection.close();
            });
            connection.execSql(request);
        });
    });
}