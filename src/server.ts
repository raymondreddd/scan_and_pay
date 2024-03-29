import http from 'http';
import express, { Express } from 'express';
import Database from './loaders/database';
import { FrameworkLoader } from './loaders/framework';
import TableRouter from './api/admin/table';
import AuthRouter from './api/admin/auth';
import UserRouter from './api/user/user';
import OrderRouter from './api/order/order';
import ProductRouter from './api/product/product';
// import MessageQueue from './publisher/publisher';

const Server = async (): Promise<{ app: Express; server: http.Server }> => {
    const app = express();

    const server = http.createServer(app);

    // Loaders
    await Database.Loader();
    // await MessageQueue.Loader();
    // cookie parser, static, 
    FrameworkLoader({ app });

    // API Routes
    app.use('/api/v1/tables', TableRouter);
    app.use('/api/v1/orders', OrderRouter);
    app.use('/api/v1/products', ProductRouter);
    app.use('/api/v1/users/', UserRouter);
    app.use('/api/v1/auth', AuthRouter);

    // app.use(RefreshTokenMiddleware);
    // app.use('/v1/other', OtherRouter);

    app.get('/', (request: express.Request, response: express.Response) =>
        response.json({
            status: true,
            content: {
                data: 'Welcome to scan & pay API',
            },
        })
    );

    app.all('*', async () => {
        //   throw new NotFoundError();
    });

    // Middlewares
    // app.use(ErrorHandler);

    return { app, server };
};
export default Server;

// const Server = http.createServer(app);

// export default Server;
