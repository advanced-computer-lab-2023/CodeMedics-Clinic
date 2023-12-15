const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const CartSchema = new Schema({
    PatientId: {
        type: String
    },
    items:{
        type: [{
            MedicineId: {
                type: String
            },
            Quantity: {
                type: Number
            },
            Price: {
                type: Number
            }
        }
    ]
    }
}, {timestamps: true});

const Cart = mongoose.model('Cart', CartSchema, 'Cart');
module.exports = Cart;