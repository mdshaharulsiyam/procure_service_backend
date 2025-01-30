import { Express } from 'express';
import express from 'express';
import path from 'path';
import { auth_router } from '../apis/Auth/auth_route';
import { verification_router } from '../apis/Verification/verification_route';



export const routeMiddleware = (app: Express) => {
    app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));

    app.use(auth_router)
    app.use(verification_router)
}