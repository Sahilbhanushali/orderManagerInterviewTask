import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            index: true
        },

        email: {
            type: String,
            required: true,
            lowercase: true,
            unique: true,
            index: true
        },

        phone: {
            type: String,
            required: true,
            match: /^[6-9]\d{9}$/
        },

        isDeleted: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);

export const Customer = mongoose.model('Customer', customerSchema);
