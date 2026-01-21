import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
    {
        customerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Customer',
            required: true,
            index: true
        },

        totalAmount: {
            type: Number,
            required: true,
            min: 0
        },

        status: {
            type: String,
            enum: ['pending', 'completed', 'cancelled'],
            default: 'pending',
            index: true
        }
    },
    { timestamps: true }
);

export const Order = mongoose.model('Order', orderSchema);
