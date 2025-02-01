import express from 'express';
import asyncWrapper from '../../middleware/asyncWrapper';
import { auth_controller } from './auth_controller';
import verifyToken from '../../middleware/verifyToken';
import config from '../../DefaultConfig/config';
export const auth_router = express.Router();
auth_router
    .post('/auth/sign-up', asyncWrapper(auth_controller.create))

    .post('/auth/sign-in', asyncWrapper(auth_controller.sing_in))

    .post('/auth/reset-password', verifyToken(config.USER, true, config.ACCESS_TOKEN_NAME), asyncWrapper(auth_controller.reset_password))

    .post('/auth/change-password', verifyToken(config.USER), asyncWrapper(auth_controller.change_password))

    .patch('/auth/update-profile', verifyToken(config.USER), asyncWrapper(auth_controller.update_auth))

    .get('/auth/profile', verifyToken(config.USER), asyncWrapper(auth_controller.get_profile))

    .post('/auth/logout', asyncWrapper(auth_controller.sing_out))

    .patch('/auth/verify-identity/:id', verifyToken(config.ADMIN), asyncWrapper(auth_controller.verify_identity))

    .patch('/auth/block/:id', verifyToken(config.ADMIN), asyncWrapper(auth_controller.block_auth))