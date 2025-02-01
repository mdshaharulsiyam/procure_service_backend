import mongoose, { model } from 'mongoose';
import Queries, { QueryKeys, SearchKeys } from "../../utils/Queries";
import { category_model } from "./category_model";
import { service_model } from '../Service/service_model';
import { business_model } from '../Business/business_model';
import hashText from '../../utils/hashText';
import { IAuth } from '../Auth/auth_types';

async function create(data: { [key: string]: string }) {
    const result = await category_model.create(data)
    return {
        success: true,
        message: 'category created successfully',
        data: result
    }
}

async function get_all(queryKeys: QueryKeys, searchKeys: SearchKeys, populatePath?: string | string[], selectFields?: string | string[], modelSelect?: string) {
    return await Queries(category_model, queryKeys, searchKeys, populatePath, selectFields, modelSelect)
}

async function update(id: string, data: { [key: string]: string }) {
    const result = await category_model.findByIdAndUpdate(id, {
        $set: {
            ...data
        }
    }, { new: true })

    return {
        success: true,
        message: 'category updated successfully',
        data: result
    }
}

async function delete_category(id: string, data: { [key: string]: string }, auth: IAuth) {

    const is_exists = await category_model.findOne({ _id: id, name: data?.name })

    if (!is_exists) throw new Error(`category not found`)

    const password = await hashText(data?.password)

    if (password !== auth?.password) throw new Error(`password doesn't match`)

    const session = await mongoose.startSession();
    const result = await session.withTransaction(async () => {
        const [result] = await Promise.all([
            category_model.findByIdAndDelete(id, { session }),
            service_model.deleteMany({ category: id }, { session }),
            business_model.deleteMany({ category: id }, { session })
        ])
        return result
    })
    await session.endSession();
    return {
        success: true,
        message: 'category deleted successfully',
        data: result
    }
}

export const category_service = Object.freeze({
    create,
    get_all,
    update,
    delete_category
})