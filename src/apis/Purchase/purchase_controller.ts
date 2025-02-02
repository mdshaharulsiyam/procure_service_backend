import { Request, Response } from "express";
import { IAuth } from "../Auth/auth_types";
import { purchase_service } from "./purchase_service";
import { HttpStatus } from "../../DefaultConfig/config";
import { sendResponse } from "../../utils/sendResponse";
import { SearchKeys } from "../../utils/Queries";

async function create(req: Request, res: Response) {
    const result = await purchase_service.create(req?.body, req?.user as IAuth)

    sendResponse(
        res,
        HttpStatus.SUCCESS,
        result
    )
}

async function delete_purchase(req: Request, res: Response) {

    const result = await purchase_service.delete_purchase(req?.params?.id, req?.user?._id as string)
    sendResponse(
        res,
        HttpStatus.SUCCESS,
        result
    )
}

async function get_all(req: Request, res: Response) {

    const { search, ...otherValues } = req?.query;
    const searchKeys: SearchKeys = {}

    if (search) searchKeys.name = search as string

    const queryKeys = {
        ...otherValues
    }

    const populatePath: string | string[] = ['issue', 'issue.service', 'issue.category']
    const selectFields: string | string[] = ['', '', '']
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
