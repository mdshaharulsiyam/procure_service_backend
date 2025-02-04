import express from 'express'
import asyncWrapper from '../../middleware/asyncWrapper'
import { quoted_controller } from './quoted_controller'
import verifyToken from '../../middleware/verifyToken'
import config from '../../DefaultConfig/config'

export const quoted_router = express.Router()

quoted_router
    .post('/quoted/create', verifyToken(config.USER), asyncWrapper(quoted_controller.create))

    .get('/quoted/get-all', asyncWrapper(quoted_controller.get_quote))

    .patch('/quoted/update-status/:id', verifyToken(config.USER), asyncWrapper(quoted_controller.update_quote_status))