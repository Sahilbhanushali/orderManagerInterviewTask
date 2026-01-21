import { Customer } from '../models/customer.model.js';

export const CustomerRepository = {
    create(data) {
        return Customer.create(data);
    },


    findById(id) {
        return Customer.findOne({ _id: id, isDeleted: false });
    },

    findByEmail(email) {
        return Customer.findOne({ email, isDeleted: false });
    },

    search(query) {
        return Customer.find({
            isDeleted: false,
            $or: [
                { name: new RegExp(query, 'i') },
                { email: new RegExp(query, 'i') }
            ]
        });
    },

    updateById(id, data) {

        return Customer.findOneAndUpdate(
            { _id: id, isDeleted: false },
            data,
            { new: true }
        );
    },

    delete(id) {
        return Customer.findByIdAndUpdate(
            id,
            { isDeleted: true },
            { new: true }
        );
    }
};