import { Request, Response } from "express";
import { issues_service } from "./issues_srevice";
import { sendResponse } from "../../utils/sendResponse";
import { HttpStatus } from "../../DefaultConfig/config";
import { SearchKeys } from "../../utils/Queries";

async function crete(req: Request, res: Response) {
    req.body.user = req?.user?._id

    const result = await issues_service.create(req?.body)
    sendResponse(
        res,
        HttpStatus.SUCCESS,
        result
    )
}


async function update(req: Request, res: Response) {

    req.body.user = req?.user?._id

    const result = await issues_service.update(req?.params?.id, req?.body)
    sendResponse(
        res,
        HttpStatus.SUCCESS,
        result
    )
}

async function delete_issue(req: Request, res: Response) {

    const result = await issues_service.delete_issue(req?.params?.id, req?.user?._id as string)
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

    const populatePath: string | string[] = 'user'
    const selectFields: string | string[] = 'name img'
    const modelSelect: string = '-phone -email'

    const result = await issues_service.get_all(queryKeys, searchKeys, populatePath, selectFields, modelSelect)
    sendResponse(
        res,
        HttpStatus.SUCCESS,
        result
    )
}


export const issues_controller = Object.freeze({
    crete,
    update,
    delete_issue,
    get_all
}) 