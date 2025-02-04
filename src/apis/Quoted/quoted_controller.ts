import { get } from 'mongoose';
import { Request, Response } from "express";
import { quoted_service } from "./quoted_service";
import { IAuth } from "../Auth/auth_types";
import { sendResponse } from "../../utils/sendResponse";
import { HttpStatus } from "../../DefaultConfig/config";
import { SearchKeys } from '../../utils/Queries';

async function create(req: Request, res: Response) {

    const result = await quoted_service.create(req?.body, req?.user as IAuth)

    sendResponse(
        res,
        HttpStatus.SUCCESS,
        result
    )

}

async function update_quote_status(req: Request, res: Response) {

    const result = await quoted_service.update_quote_status(req?.params?.id, req?.user as IAuth, req?.body.status)

    sendResponse(
        res,
        HttpStatus.SUCCESS,
        result
    )

}
async function get_quote(req: Request, res: Response) {
    const { search, ...otherValues } = req?.query;
    const searchKeys: SearchKeys = {}

    if (search) searchKeys.name = search as string

    const queryKeys = {
        ...otherValues
    }

    let populatePath = ['user', 'user_to', 'issue',]
    let selectFields: string | string[] = ['name img', 'name img', '-phone -email']

    const modelSelect: string = ''


    if (req?.user?.role != "ADMIN" && req?.user?.role != "SUPER_ADMIN") {
        if (req?.user?.role == "USER") {
            queryKeys.user_to = req?.user?._id as string
            populatePath = ['user', 'issue',]
            selectFields = ['name img', '-phone -email']

        } else {
            queryKeys.user = req?.user?._id as string
            populatePath = ['user_to', 'issue',]
            selectFields = ['name img', '-phone -email']

        }
    }


    const result = await quoted_service.get_all(queryKeys, searchKeys, populatePath, selectFields, modelSelect)
    return sendResponse(
        res,
        HttpStatus.SUCCESS,
        result
    )

}

export const quoted_controller = Object.freeze({
    create,
    update_quote_status,
    get_quote
})