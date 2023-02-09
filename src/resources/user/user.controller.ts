import { Router, Request, Response, NextFunction } from 'express';
import Controller from '@/utils/interfaces/controller.interface';
import HttpException from '@/utils/exceptions/http.exception';
import UserService from '@/resources/user/user.service';
import validationMiddleware from '@/middleware/validation.middleware';
import validate from '@/resources/user/user.validation';
import authenticated from '@/middleware/authenticated.middleware';

class UserController implements Controller {
    public path = '/users';
    public router = Router();
    private userService = new UserService();

    constructor() {
        console.log(this.userService);

        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(
            `${this.path}/register`,
            validationMiddleware(validate.register),
            this.register
        );
        this.router.post(
            `${this.path}/login`,
            validationMiddleware(validate.login),
            this.login
        );
        this.router.get(`${this.path}`, authenticated, this.getUser);
    }

    private register = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { email, name, password } = req.body;
            const token = await this.userService.register(
                email,
                name,
                password,
                'user'
            );
            res.status(201).json({ token });
        } catch (error) {
            console.log('UserController register :: ', error);
            next(new HttpException(400, 'Error registering new User!'));
        }
    };

    private login = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { email, password } = req.body;
            const token = await this.userService.login(email, password);
            res.status(201).json({ token });
        } catch (error) {
            next(new HttpException(400, 'Error log in!'));
        }
    };

    private getUser(
        req: Request,
        res: Response,
        next: NextFunction
    ): Response | void {
        if (!req.user) {
            next(new HttpException(404, 'No Logged in User!'));
        }
        res.status(200).json({ user: req.user });
    }
}

export default UserController;
