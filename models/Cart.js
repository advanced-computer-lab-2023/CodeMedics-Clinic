const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const CartSchema = new Schema({
    patientId: {
        type: String
    },
    items: {
        type: [
            {
                medicineId: {
                    type: String
                },
                quantity: {
                    type: Number
                },
                price: {
                    type: Number
                }
            }
        ]
    }
}, {timestamps: true});

const Cart = mongoose.model('Cart', CartSchema, 'Cart');
module.exports = Cart;
