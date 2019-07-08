exports.create = function(req, res) {
    // var newCustomer = req.body;
    // customers["customer" + newCustomer.id] = newCustomer;
    // + JSON.stringify(customers, null, 4)
    // + JSON.stringify(newCustomer, null, 4)
    console.log("--->After Post, customers:\n");
    res.end("Post Successfully: \n");
};

exports.findAll = function(req, res) {
    // console.log("--->Find All: \n" + JSON.stringify(customers, null, 4));
    // res.end("All Customers: \n" + JSON.stringify(customers, null, 4));
    console.log("--->get Find All: \n");
    res.end("get All Customers: \n");
};

exports.findOne = function(req, res) {
    console.log("--->get Find customer: \n");
    res.end("get Find a Customer:\n");
    // var customer = customers["customer" + req.params.id];
    // console.log("--->Find customer: \n" + JSON.stringify(customer, null, 4));
    // res.end("Find a Customer:\n" + JSON.stringify(customer, null, 4));
};

exports.update = function(req, res) {
    console.log("--->Update Successfully, customers: \n");
    res.end("Update Successfully! \n");
    // var id = parseInt(req.params.id);
    // var updatedCustomer = req.body;
    // if (customers["customer" + id] != null) {
    //     // update data
    //     customers["customer" + id] = updatedCustomer;

    //     console.log("--->Update Successfully, customers: \n" + JSON.stringify(customers, null, 4))

    //     // return
    //     res.end("Update Successfully! \n" + JSON.stringify(updatedCustomer, null, 4));
    // } else {
    //     res.end("Don't Exist Customer:\n:" + JSON.stringify(updatedCustomer, null, 4));
    // }
};

exports.delete = function(req, res) {
    console.log("--->After deletion, customer list:\n");
    res.end("Deleted customer: \n");
    // var deleteCustomer = customers["customer" + req.params.id];
    // delete customers["customer" + req.params.id];
    // console.log("--->After deletion, customer list:\n" + JSON.stringify(customers, null, 4));
    // res.end("Deleted customer: \n" + JSON.stringify(deleteCustomer, null, 4));
};