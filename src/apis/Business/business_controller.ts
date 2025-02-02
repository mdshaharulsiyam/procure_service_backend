import { Request, Response } from "express";
import { business_service } from "./business_service";
import { sendResponse } from "../../utils/sendResponse";
import { HttpStatus } from "../../DefaultConfig/config";
import { SearchKeys } from "../../utils/Queries";

async function create(req: Request, res: Response) {
    req.body.auth = req?.user?._id

    const business_reg_document = !Array.isArray(req.files) && req.files?.business_reg_document && req.files.business_reg_document.length > 0 && req.files.business_reg_document[0]?.path || null;

    if (business_reg_document) req.body.business_reg_document = business_reg_document

    const result = await business_service.create(req?.body)

    sendResponse(
        res,
        HttpStatus.CREATED,
        result
    )
}

async function update(req: Request, res: Response) {

    req.body.auth = req?.user?._id

    const business_reg_document = !Array.isArray(req.files) && req.files?.business_reg_document && req.files.business_reg_document.length > 0 && req.files.business_reg_document[0]?.path || null;

    if (business_reg_document) req.body.business_reg_document = business_reg_document

    const result = await business_service.update(req?.params?.id, req?.body)
    sendResponse(
        res,
        HttpStatus.SUCCESS,
        result
    )

}

async function delete_business(req: Request, res: Response) {

    const result = await business_service.delete_business(req?.params?.id, req?.user?._id as string)
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

    const populatePath: string | string[] = ['services.service', 'services.category']
    const selectFields: string | string[] = ['name img _id', 'name img _id']
    const modelSelect: string = 'name img _id'

    const result = await business_service.get_all(queryKeys, searchKeys, populatePath, selectFields, modelSelect)
    sendResponse(
        res,
        HttpStatus.SUCCESS,
        result
    )
}

async function verify_business(req: Request, res: Response) {

    const result = await business_service.verify_business(req?.params?.id)

    sendResponse(
        res,
        HttpStatus.SUCCESS,
        result
    )
}

export const business_controller = {
    create,
    update,
    delete_business,
    get_all,
    verify_business
}