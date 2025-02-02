import Queries, { QueryKeys, SearchKeys } from "../../utils/Queries"
import { business_model } from "../Business/business_model"
import { review_model } from "./review_model"

async function create(data: { [key: string]: string }) {
    const { is_approved, ...otherValues } = data
    const [result] = await Promise.all([
        review_model.create(otherValues),

        ...(data?.business ? [business_model.updateOne({ _id: data?.business }, {
            $set: {
                rating: {
                    $divide: [
                        { $add: [{ $multiply: ["$rating", "$total_rated"] }, data?.rating] },
                        { $inc: ["$total_rated", 1] }
                    ]
                },
                $inc: { total_rated: 1 }
            }
        })] : [])

    ])
    return {
        success: true,
        message: 'review created successfully',
        data: result
    }

}
async function delete_review(id: string) {
    const result = await review_model.findByIdAndDelete({ _id: id })
    return {
        success: true,
        message: 'review deleted successfully',
        data: result
    }

}

async function approve(id: string) {
    const result = await review_model.findOneAndUpdate({ _id: id }, [
        {
            $set: {
                is_approved: {
                    $cond: {
                        if: { $eq: ["$is_approved", false] },
                        then: true,
                        else: false
                    }
                }
            }
        }
    ], { new: true }).lean();
    return {
        success: true,
        message: `review ${result?.is_approved} successfully`,
        data: result
    }
}

async function get_all(queryKeys: QueryKeys, searchKeys: SearchKeys, populatePath?: string | string[], selectFields?: string | string[], modelSelect?: string) {
    return await Queries(review_model, queryKeys, searchKeys, populatePath, selectFields, modelSelect)

}

export const review_service = Object.freeze({
    create,
    delete_review,
    approve,
    get_all
})