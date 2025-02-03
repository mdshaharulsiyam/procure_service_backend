import mongoose from "mongoose";
import { IAuth } from "../Auth/auth_types";
import { issue_model } from "../Issues/issue_model";
import { purchase_model } from "../Purchase/purchase_model";
import { quoted_model } from "./quoted_model";
import Queries, { QueryKeys, SearchKeys } from "../../utils/Queries";
import { business_model } from "../Business/business_model";

async function create(data: { [key: string]: string }, auth: IAuth) {

    const is_exist_issue = await issue_model.findOne({ _id: data?.issue }).lean()

    if (!is_exist_issue) throw new Error(`issue not found`)

    if (is_exist_issue?.user == auth?._id) throw new Error(`you can't quote your own issue`)

    const session = await mongoose.startSession();
    try {

        const result = await session.withTransaction(async () => {
            const [result] = await Promise.all([
                quoted_model.insertMany(data, { session }),
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
    const is_exist_issue: any = await quoted_model.findOne({ issue: id }).populate('issue').populate('issue.user').lean()

    if (!is_exist_issue) throw new Error(`quote not found`)

    if (is_exist_issue?.user?._id != auth?._id && is_exist_issue?.issue?.user?._id != auth?._id) throw new Error(`you can't update this quote`)


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
            message: 'issue quoted successfully',
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