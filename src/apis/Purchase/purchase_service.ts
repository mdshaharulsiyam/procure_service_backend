import mongoose from "mongoose"
import { IAuth } from "../Auth/auth_types"
import { category_model } from "../Category/category_model"
import { issue_model } from "../Issues/issue_model"
import { IIssue } from "../Issues/issue_type"
import { purchase_model } from "./purchase_model"
import auth_model from "../Auth/auth_model"
import Queries, { QueryKeys, SearchKeys } from "../../utils/Queries"

async function create(data: { [key: string]: string }, auth: IAuth) {

    const is_exist_issue = await issue_model.findOne({ _id: data?.issue }).lean()

    if (!is_exist_issue) throw new Error(`issue not found`)

    const quote_price = await category_model.findOne({ _id: is_exist_issue?.category }).lean()

    if (!quote_price) throw new Error(`category not found`)

    if (auth?.credits < Number(quote_price?.quote_price)) throw new Error(`You don't have enough credits`)

    const session = await mongoose.startSession();

    const result = await session.withTransaction(async () => {
        const [result] = await Promise.all([
            purchase_model.insertMany(data, { session }),
            auth_model.updateOne({ email: auth?.email }, { $inc: { credits: -Number(quote_price?.quote_price) } }, { session })
        ])

        return result
    })

    return {
        success: true,
        message: 'issue created successfully',
        data: result
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

async function get_all(queryKeys: QueryKeys, searchKeys: SearchKeys, populatePath?: string | string[], selectFields?: string | string[], modelSelect?: string) {
    return await Queries(purchase_model, queryKeys, searchKeys, populatePath, selectFields, modelSelect)
}

export const purchase_service = Object.freeze({
    create,
    delete_purchase,
    get_all
})