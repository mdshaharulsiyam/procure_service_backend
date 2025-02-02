import express from 'express'
import asyncWrapper from '../../middleware/asyncWrapper'
import { review_controller } from './review_controller'
import verifyToken from '../../middleware/verifyToken'
import config from '../../DefaultConfig/config'

export const review_router = express.Router()

review_router
    .post('/review/create', verifyToken(config.USER), asyncWrapper(review_controller.create))

    .get('/review/get-all', asyncWrapper(review_controller.get_all))

    .delete('/review/delete/:id', verifyToken(config.ADMIN), asyncWrapper(review_controller.delete_review))

    .patch('/review/approve/:id', verifyToken(config.ADMIN), asyncWrapper(review_controller.approve))