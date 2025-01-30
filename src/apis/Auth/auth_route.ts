import express from 'express';
import asyncWrapper from '../../middleware/asyncWrapper';
import { auth_controller } from './auth_controller';
export const auth_router = express.Router();
auth_router
    .post('/auth/sign-up', asyncWrapper(auth_controller.create))