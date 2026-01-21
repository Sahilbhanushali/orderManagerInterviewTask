import mongoose from 'mongoose';
import { Order } from '../models/order.model.js';

export const OrderRepository = {
    create(data, session) {

        return Order.create([data], { session });
    },

    findById(id) {

        return Order.findById(id);
    },

    updateStatus(orderId, status, session) {
        return Order.findByIdAndUpdate(
            orderId,
            { status },
            { new: true, session }
        );
    },


    async findAll(filter, pagination) {
        return this.findWithDetails(filter, pagination);
    },


    count(filter) {
        return Order.countDocuments(filter);
    },

    findWithDetails(filter, pagination) {
        const { skip, limit } = pagination;


        const query = { ...filter };
        if (query.customerId && typeof query.customerId === 'string') {
            query.customerId = new mongoose.Types.ObjectId(query.customerId);
        }
        if (query._id && typeof query._id === 'string') {
            query._id = new mongoose.Types.ObjectId(query._id);
        }

        return Order.aggregate([
            { $match: query },
            {
                $lookup: {
                    from: 'customers',
                    localField: 'customerId',
                    foreignField: '_id',
                    as: 'customer'
                }
            },
            { $unwind: { path: '$customer', preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: 'orderitems',
                    localField: '_id',
                    foreignField: 'orderId',
                    as: 'items'
                }
            },
            {
                $lookup: {
                    from: 'products',
                    localField: 'items.productId',
                    foreignField: '_id',
                    as: 'productDetails'
                }
            },

            { $sort: { createdAt: -1 } },
            { $skip: skip || 0 },
            { $limit: limit || 10 }
        ]);
    }
};