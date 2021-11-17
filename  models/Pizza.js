const { Schema, model } = require('mongoose');
const Pizza = model('Pizza', PizzaSchema);

const PizzaSchema = new Schema({
    pizzaName: {
        type: String
    },
    createdBy: {
        type:String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    size: {
        type: String,
        default: 'Large'
    },
    toppings: []
});

module.exports = Pizza;