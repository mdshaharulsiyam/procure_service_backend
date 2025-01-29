import { Express } from 'express';
import express from 'express';
import path from 'path';



export const routeMiddleware = (app: Express) => {
    app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));

}