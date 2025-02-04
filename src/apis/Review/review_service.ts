import mongoose from "mongoose"
import Queries, { QueryKeys, SearchKeys } from "../../utils/Queries"
import { business_model } from "../Business/business_model"
import { purchase_model } from "../Purchase/purchase_model"
import { review_model } from "./review_model"

async function create(data: { [key: string]: string }) {

    let business = null
    let issue = null
    let review_for = "WEBSITE"
    const { is_approved, id, rating, description, img, user } = data

    if (id) {

        const is_exist_purchase = await purchase_model.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(id)
                }
            },
            {
                $lookup: {
                    from: 'issues',
                    localField: 'issue',
                    foreignField: '_id',
                    as: 'issue'
                }
            },
            {
                $unwind: {
                    path: '$issue',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    user: "$user",
                    category: "$issue.category",
                    service: "$issue.service",
                    issue: "$issue._id"
                }
            },
        ])

        if (!is_exist_purchase || (is_exist_purchase && Array?.isArray(is_exist_purchase) && is_exist_purchase?.length <= 0)) throw new Error(`issue not found`)

        const category = Array?.isArray(is_exist_purchase) ? is_exist_purchase[0]?.category : ""
        const service = Array?.isArray(is_exist_purchase) ? is_exist_purchase[0]?.service : ""
        const b_user = Array?.isArray(is_exist_purchase) ? is_exist_purchase[0]?.user : ""

        if (b_user?.toString() == user?.toString()) throw new Error(`you can't review your own issue`)

        const business_id = await business_model.findOne({
            "services.category": category,
            "services.service": { $in: [service] },
            auth: b_user
        }).select('_id').lean()

        if (!business_id) throw new Error(`business not found`)
        business = business_id?._id
        issue = Array?.isArray(is_exist_purchase) ? is_exist_purchase[0]?.issue : ""
        review_for = "SERVICE"
    }
    const session = await mongoose.startSession();
    try {
        const result = await session.withTransaction(async () => {
            const [result] = await Promise.all([
                review_model.insertMany([{ description, img, business, issue, review_for, rating: Number(rating), user }], { session }),

                business_model.findByIdAndUpdate(business, [
                    {
                        $set: {
                            'rating': {
                                $divide: [
                                    { $add: [{ $multiply: ["$rating", "$total_rated"] }, Number(rating)] },
                                    { $add: ["$total_rated", 1] }
                                ]
                            },
                            'total_rated': { $add: ["$total_rated", 1] }
                        }
                    }
                ], { session })

            ])
            return {
                success: true,
                message: 'review created successfully',
                data: result
            }
        })
        return result
    } catch (error) {
        throw error;
    } finally {
        await session.endSession();
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