"use strict";

const events = require("./events");

//execute getEvents query => result as JSON
module.exports.register = async server => {
    await events.register(server);
};