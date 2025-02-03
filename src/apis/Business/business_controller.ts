import { NextFunction, Request, Response } from "express";
import { business_service } from "./business_service";
import { sendResponse } from "../../utils/sendResponse";
import { HttpStatus } from "../../DefaultConfig/config";
import { SearchKeys } from "../../utils/Queries";

async function create(req: Request, res: Response, next: NextFunction) {

    const business_reg_document = !Array.isArray(req.files) && req.files?.business_reg_document && req.files.business_reg_document.length > 0 && req.files.business_reg_document?.map((doc: any) => doc.path) || null;

    const img = !Array.isArray(req.files) && req.files?.img && req.files.img.length > 0 && req.files.img?.map((doc: any) => doc.path) || null;

    const logo = !Array.isArray(req.files) && req.files?.logo && req.files.logo.length > 0 && req.files.logo[0]?.path || null;

    const { data, auth } = req.body

    const formateData = {
        ...JSON.parse(data),
        auth: (req?.user?.role != "ADMIN" && req?.user?.role != "SUPER_ADMIN") ? req?.user?._id : auth,
        business_reg_document,
        media: {
            img,
            logo
        }
    }

    const result = await business_service.create(formateData)
    sendResponse(
        res,
        HttpStatus.CREATED,
        result
    )
}

async function update(req: Request, res: Response) {

    const business_reg_document = !Array.isArray(req.files) && req.files?.business_reg_document && req.files.business_reg_document.length > 0 && req.files.business_reg_document?.map((doc: any) => doc.path) || null;

    const img = !Array.isArray(req.files) && req.files?.img && req.files.img.length > 0 && req.files.img?.map((doc: any) => doc.path) || null;

    const logo = !Array.isArray(req.files) && req.files?.logo && req.files.logo.length > 0 && req.files.logo[0]?.path || null;

    const { data } = req.body

    const formateData = {
        ...JSON.parse(data),
        auth: req?.user?._id,
        business_reg_document,
        media: {
            img,
            logo
        }
    }

    const result = await business_service.update(req?.params?.id, formateData)
    sendResponse(
        res,
        HttpStatus.SUCCESS,
        result
    )

}

async function delete_business(req: Request, res: Response) {
    const { auth } = req.query

    const userId = (req?.user?.role != "ADMIN" && req?.user?.role != "SUPER_ADMIN") ? req?.user?._id : auth

    const result = await business_service.delete_business(req?.params?.id, userId as string)
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
        ...otherValues,
        ...(req?.user?.role != "ADMIN" && req?.user?.role != "SUPER_ADMIN" && { auth: req?.user?._id }),
    }

    const populatePath: string | string[] = ['services.service', 'services.category']
    const selectFields: string | string[] = ['name img _id', 'name img _id']
    const modelSelect: string = 'rating total_rated _id is_verified total_provided_service'

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