import express from 'express'
import asyncWrapper from '../../middleware/asyncWrapper'
import { issues_controller } from './issues_controller'
import verifyToken from '../../middleware/verifyToken'
import config from '../../DefaultConfig/config'

export const issues_router = express.Router()

issues_router
    .post('/issue/create', verifyToken(config.USER), asyncWrapper(issues_controller.crete))

    .get('/issue/get-all', asyncWrapper(issues_controller.get_all))

    .patch('/issue/update/:id', verifyToken(config.USER), asyncWrapper(issues_controller.update))

    .delete('/issue/delete/:id', verifyToken(config.USER), asyncWrapper(issues_controller.delete_issue))