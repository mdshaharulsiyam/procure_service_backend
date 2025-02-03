import { Request, Response } from "express";
import { IAuth } from "../Auth/auth_types";
import { purchase_service } from "./purchase_service";
import { HttpStatus } from "../../DefaultConfig/config";
import { sendResponse } from "../../utils/sendResponse";
import { SearchKeys } from "../../utils/Queries";
import { purchase_model } from "./purchase_model";

async function create(req: Request, res: Response) {
    const result = await purchase_service.create(req?.body, req?.user as IAuth)

    sendResponse(
        res,
        HttpStatus.SUCCESS,
        result
    )
}

async function delete_purchase(req: Request, res: Response) {

    const { role } = req?.user as IAuth

    const { id } = req?.query

    const _id = (role != "ADMIN" && role != "SUPER_ADMIN") ? req?.user?._id : id ? id : ''

    const result = await purchase_service.delete_purchase(req?.params?.id, _id as string)

    sendResponse(
        res,
        HttpStatus.SUCCESS,
        result
    )
}

async function get_all(req: Request, res: Response) {
    const { id } = req?.query
    const { role } = req?.user as IAuth
    const { search, ...otherValues } = req?.query;
    const searchKeys: SearchKeys = {}

    if (search) searchKeys.name = search as string

    const queryKeys = {
        ...otherValues,
        ...((role != "ADMIN" && role != "SUPER_ADMIN") ? { user: req?.user?._id } : id ? { user: id } : {})
    }

    const populatePath: any = [{ path: 'issue', populate: [{ path: 'category', select: 'name img' }, { path: 'service', select: 'name img' }] }]
    const selectFields: string | string[] = ['']
    const modelSelect: string = ''

    const result = await purchase_service.get_all(queryKeys, searchKeys, populatePath, selectFields, modelSelect)

    sendResponse(
        res,
        HttpStatus.SUCCESS,
        result
    )

}

export const purchase_controller = Object.freeze({
    create,
    delete_purchase,
    get_all
})
