import express from 'express'
import asyncWrapper from '../../middleware/asyncWrapper'
import { business_controller } from './business_controller'
import verifyToken from '../../middleware/verifyToken'
import config from '../../DefaultConfig/config'
import uploadFile from '../../middleware/fileUploader'

export const business_router = express.Router()

business_router
    .post('/business/create', verifyToken(config.USER), uploadFile(), asyncWrapper(business_controller.create))

    .get('/business/get-all', asyncWrapper(business_controller.get_all))

    .patch('/business/update/:id', verifyToken(config.USER), uploadFile(), asyncWrapper(business_controller.update))

    .delete('/business/delete/:id', verifyToken(config.USER), asyncWrapper(business_controller.delete_business))

    .patch('/business/verify/:id', verifyToken(config.ADMIN), asyncWrapper(business_controller.verify_business))