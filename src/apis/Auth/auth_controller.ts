import { Request, Response } from "express";
import { auth_service } from "./auth_service";
import { sendResponse } from "../../utils/sendResponse";
import { HttpStatus } from "../../DefaultConfig/config";

async function create(req: Request, res: Response) {

    const result = await auth_service.create(req.body);

    sendResponse(
        res,
        HttpStatus.SUCCESS,
        result
    )
}

export const auth_controller = Object.freeze({
    create
})