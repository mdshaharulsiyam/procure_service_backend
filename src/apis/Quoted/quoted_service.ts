import mongoose from "mongoose";
import { IAuth } from "../Auth/auth_types";
import { issue_model } from "../Issues/issue_model";
import { purchase_model } from "../Purchase/purchase_model";
import { quoted_model } from "./quoted_model";
import Queries, { QueryKeys, SearchKeys } from "../../utils/Queries";
import { business_model } from "../Business/business_model";

async function create(data: { [key: string]: string }, auth: IAuth) {

    const [is_exist_issue, is_exist_purchase] = await Promise.all([
        issue_model.findOne({ _id: data?.issue }).lean(),
        purchase_model.findOne({ issue: data?.issue, user: auth?._id }).lean()//is_quoted: true 
    ])

    if (!is_exist_purchase) throw new Error(`you ca't quote this issue`)

    if (is_exist_purchase?.is_quoted) throw new Error(`you have already quoted this issue`)

    if (!is_exist_issue) throw new Error(`issue not found`)

    if (is_exist_issue?.user == auth?._id) throw new Error(`you can't quote your own issue`)

    const session = await mongoose.startSession();
    try {

        const result = await session.withTransaction(async () => {
            const [result] = await Promise.all([
                quoted_model.insertMany({ ...data, user: auth?._id, user_to: is_exist_issue?.user }, { session }),
                purchase_model.updateOne({ issue: data?.issue }, { $set: { is_quoted: true } }, { session }),
            ])

            return result
        })
        return {
            success: true,
            message: 'issue quoted successfully',
            data: result
        }
    } catch (error) {
        throw error;
    } finally {
        await session.endSession();
    }
}

async function update_quote_status(id: string, auth: IAuth, status: string) {

    const is_exist_issue: any = await quoted_model.findOne({ _id: id }).lean()

    if (!is_exist_issue) throw new Error(`quote not found`)

    if (is_exist_issue?.status == 'cancelled') throw new Error(`this quote has been cancelled`)

    if (is_exist_issue?.user?.toString() != auth?._id && is_exist_issue?.issue?.user?._to?.toString() != auth?._id && auth?.role !== 'ADMIN' && auth?.role !== 'SUPER_ADMIN') throw new Error(`you can't update this quote`)


    const session = await mongoose.startSession();

    try {
        const result = await session.withTransaction(async () => {

            const [result] = await Promise.all([
                purchase_model.updateOne({ issue: id, user: is_exist_issue?.user?._id }, { $set: { status: status } }, { session }),
                issue_model.updateOne({ _id: id }, { $set: { status: status } }, { session }),
                ...(status == 'closed' ? [business_model.updateOne({ _id: is_exist_issue?.user?._id }, { $inc: { total_provided_service: 1 } }, { session })] : [])
            ])

            return result

        })
        return {
            success: true,
            message: `quote status updated to ${status} successfully`,
            data: result
        }
    } catch (error) {
        throw error;
    } finally {
        await session.endSession();
    }

}

async function get_all(queryKeys: QueryKeys, searchKeys: SearchKeys, populatePath: any, selectFields?: string | string[], modelSelect?: string) {
    return await Queries(quoted_model, queryKeys, searchKeys, populatePath, selectFields, modelSelect)
}

export const quoted_service = Object.freeze({
    create,
    update_quote_status,
    get_all
})