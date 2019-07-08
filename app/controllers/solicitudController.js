/*
Route path: /users/:userId/books/:bookId
Request URL: http://localhost:3000/users/34/books/8989
req.params: { "userId": "34", "bookId": "8989" } 
*/

exports.create = function(req, res) {
    console.log("--->After Post, customers:\n");
    res.end("Post Successfully: \n");
};

exports.aprobar = function(req, res) {
    console.log("--->post Aprobar:\n");
    res.end("post Aprobar Customers: \n");
};