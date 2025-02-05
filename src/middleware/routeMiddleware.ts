import { Express } from 'express';
import express from 'express';
import path from 'path';
import { auth_router } from '../apis/Auth/auth_route';
import { verification_router } from '../apis/Verification/verification_route';
import { category_router } from '../apis/Category/category_route';
import { service_router } from '../apis/Service/service_route';
import { business_router } from '../apis/Business/business_router';
import { issues_router } from '../apis/Issues/issues_route';
import { purchase_router } from '../apis/Purchase/purchase_route';
import { review_router } from '../apis/Review/review_route';
import { quoted_router } from '../apis/Quoted/quoted_route';
import { notification_router } from '../apis/Notifications/notification_route';
import { setting_router } from '../apis/Setting/setting_router';
import { overview_router } from '../apis/Overview/overview_route';
import { payment_route } from '../apis/Payment/payment_route';



export const routeMiddleware = (app: Express) => {
    app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));

    app.use(auth_router)
    app.use(verification_router)
    app.use(category_router)
    app.use(service_router)
    app.use(business_router)
    app.use(issues_router)
    app.use(purchase_router)
    app.use(review_router)
    app.use(quoted_router)
    app.use(notification_router)
    app.use(setting_router)
    app.use(overview_router)
    app.use(payment_route)

}