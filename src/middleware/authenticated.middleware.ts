import { Request, Response, NextFunction } from 'express';
import HttpException from '@/utils/exceptions/http.exception';
import UserModel from '@/resources/user/user.model';
import { verifyToken } from '@/utils/token';
import Token from '@/utils/interfaces/token.interface';
import Jwt, { JsonWebTokenError } from 'jsonwebtoken';

async function authenticatedMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<Response | void> {
    const bearer = req.headers.authorization;
    if (!bearer || !bearer.startsWith('Bearer ')) {
        return next(new HttpException(401, 'Unauthorised User !'));
    }

    const accessToken = bearer.split('Bearer ')[1].trim();
    try {
        const payload: Jwt.JsonWebTokenError | Token = await verifyToken(
            accessToken
        );
        if (payload instanceof JsonWebTokenError) {
            return next(new HttpException(400, 'Unauthorised User!'));
        }

        const user = await UserModel.findById(payload.id)
            .select('-password')
            .exec();
        if (!user) {
            return next(new HttpException(400, 'Unauthorised User!'));
        }
        req.user = user;

        return next();
    } catch (error) {
        return next(new HttpException(400, 'Unauthorised User!'));
    }
}

export default authenticatedMiddleware;
