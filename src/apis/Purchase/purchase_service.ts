import mongoose from "mongoose"
import { IAuth } from "../Auth/auth_types"
import { category_model } from "../Category/category_model"
import { issue_model } from "../Issues/issue_model"
import { IIssue } from "../Issues/issue_type"
import { purchase_model } from "./purchase_model"
import auth_model from "../Auth/auth_model"
import Queries, { QueryKeys, SearchKeys } from "../../utils/Queries"

async function create(data: { [key: string]: string }, auth: IAuth) {

    if (auth?.role !== "PROFESSIONAL") throw new Error(`only professionals can purchase issues`)

    const [is_exist_issue, is_exist_purchase] = await Promise.all([
        issue_model.findOne({ _id: data?.issue }).lean(),
        purchase_model.findOne({ issue: data?.issue, user: auth?._id }).lean()

    ])

    if (is_exist_purchase) throw new Error(`you have already purchased this issue`)

    if (!is_exist_issue) throw new Error(`issue not found`)

    if (is_exist_issue?.user == auth?._id) throw new Error(`you can't purchase your own issue`)

    const quote_price = await category_model.findOne({ _id: is_exist_issue?.category }).lean()

    if (!quote_price) throw new Error(`category not found`)

    if (auth?.credits < Number(quote_price?.quote_price)) throw new Error(`You don't have enough credits`)

    const session = await mongoose.startSession();

    try {
        const result = await session.withTransaction(async () => {
            const [result] = await Promise.all([
                purchase_model.insertMany({ ...data, user: auth?._id }, { session }),
                auth_model.updateOne({ email: auth?.email }, { $inc: { credits: -Number(quote_price?.quote_price) } }, { session })
            ])

            return result
        })
        return {
            success: true,
            message: 'issue created successfully',
            data: result
        }
    } catch (error) {
        throw error;
    } finally {
        await session.endSession();
    }

}

async function delete_purchase(id: string, user: string) {
    const result = await purchase_model.findOneAndDelete({ _id: id, user })
    return {
        success: true,
        message: 'issue deleted successfully',
        data: result
    }
}

async function get_all(queryKeys: QueryKeys, searchKeys: SearchKeys, populatePath?: any, selectFields?: string | string[], modelSelect?: string) {
    return await Queries(purchase_model, queryKeys, searchKeys, populatePath, selectFields, modelSelect)
}

export const purchase_service = Object.freeze({
    create,
    delete_purchase,
    get_all
})