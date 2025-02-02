import express from 'express'
import asyncWrapper from '../../middleware/asyncWrapper'
import { purchase_controller } from './purchase_controller'
import verifyToken from '../../middleware/verifyToken'
import config from '../../DefaultConfig/config'

export const purchase_router = express.Router()

purchase_router
    .post('/purchase/create', verifyToken(config.USER), asyncWrapper(purchase_controller.create))

    .get('/purchase/get-all', asyncWrapper(purchase_controller.get_all))

    .delete('/purchase/delete/:id', verifyToken(config.USER), asyncWrapper(purchase_controller.delete_purchase))
