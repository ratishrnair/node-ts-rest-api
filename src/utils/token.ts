import Jwt, { JsonWebTokenError } from 'jsonwebtoken';
import User from '@/resources/user/user.interface';
import Token from '@/utils/interfaces/token.interface';

export const createToken = (user: User): string => {
    return Jwt.sign({ id: user._id }, process.env.JWT_SECRET as Jwt.Secret, {
        expiresIn: '1d',
    });
};

export const verifyToken = async (
    token: string
): Promise<Jwt.VerifyErrors | Token> => {
    return new Promise((resolve, reject) => {
        Jwt.verify(
            token,
            process.env.JWT_SECRET as Jwt.Secret,
            (error, payload) => {
                if (error) return reject(error);

                resolve(payload as Token);
            }
        );
    });
};

export default { createToken, verifyToken };
