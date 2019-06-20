var Connection = require('tedious').Connection;

function getConnection() {
    var config = {
        userName: 'yourusername',
        password: 'yourpassword',
        server: 'yourserver.database.windows.net',
        // If you are on Azure SQL Database, you need these next options.  
        options: { encrypt: true, database: 'AdventureWorks' }
    };

    var connection = new Connection(config);

    // connection.on('connect', function(err) {
    //     // If no error, then good to proceed.  
    //     console.log("Connected");

    //     //ejecutor statements
    //     executeStatement1();
    // });
    if (connection) {

    }
}

module.exports = {
    getConnection
}