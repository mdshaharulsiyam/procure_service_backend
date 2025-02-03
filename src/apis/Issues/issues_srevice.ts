import Queries, { QueryKeys, SearchKeys } from "../../utils/Queries"
import { issue_model } from "./issue_model"

async function create(data: { [key: string]: string }) {
    const { status, ...otherValues } = data
    const result = await issue_model.create(otherValues)
    return {
        success: true,
        message: 'issue created successfully',
        data: result
    }

}

async function update(id: string, data: { [key: string]: string }) {
    const { status, ...otherValues } = data
    const result = await issue_model.findOneAndUpdate({ _id: id, user: data?.user }, {
        $set: {
            ...otherValues
        }
    }, { new: true })

    return {
        success: true,
        message: 'issue updated successfully',
        data: result
    }
}

async function delete_issue(id: string, user: string) {
    const result = await issue_model.findByIdAndDelete({ _id: id, user })
    return {
        success: true,
        message: 'issue deleted successfully',
        data: result
    }
}

async function get_all(queryKeys: QueryKeys, searchKeys: SearchKeys, populatePath?: any, selectFields?: string | string[], modelSelect?: string) {
    return await Queries(issue_model, queryKeys, searchKeys, populatePath, selectFields, modelSelect)
}

export const issues_service = Object.freeze({

    create,
    update,
    delete_issue,
    get_all

})