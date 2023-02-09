import express, { Application } from 'express';
import mongoose from 'mongoose';
import compression from 'compression';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';

import Controller from '@/utils/interfaces/controller.interface';
import ErrorMiddleware from '@/middleware/error.middleware';

class App {
    public express: Application;
    public port: number;

    constructor(controllers: Controller[], port: number) {
        this.express = express();
        this.port = port;

        this.initializeDatabaseConnection();
        this.initializeMiddleware();
        this.initializeControllers(controllers);
        this.initializeErrorHandling();
    }

    private initializeDatabaseConnection() {
        const { MONGO_USER, MONGO_PASSWORD, MONGO_PATH } = process.env;
        // mongoose.connect(
        //     `mongodb://${MONGO_USER}:${MONGO_PASSWORD}${MONGO_PATH}`
        // );
        mongoose.set('strictQuery', false);
        mongoose.connect(`${MONGO_PATH}`);
    }

    private initializeMiddleware(): void {
        this.express.use(helmet());
        this.express.use(cors());
        this.express.use(morgan('dev'));
        // this.express.use(morgan('common'));
        this.express.use(express.json());
        this.express.use(express.urlencoded({ extended: false }));
        this.express.use(compression());
    }

    private initializeControllers(controllers: Controller[]) {
        controllers.forEach((controller: Controller) => {
            this.express.use('/api', controller.router);
        });
    }

    private initializeErrorHandling() {
        this.express.use(ErrorMiddleware);
    }

    public listen() {
        this.express.listen(this.port, () => {
            console.log('App is up and running on : ', this.port);
        });
    }
}

export default App;
