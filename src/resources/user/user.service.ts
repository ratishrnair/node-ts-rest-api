import UserModel from '@/resources/user/user.model';
import token from '@/utils/token';

class UserService {
    private user = UserModel;

    /**
     * Register a new User
     * @param email
     * @param name
     * @param password
     * @param role
     * @returns
     */
    public async register(
        email: string,
        name: string,
        password: string,
        role: string
    ): Promise<string | Error> {
        try {
            const user = await this.user.create({
                email,
                name,
                password,
                role,
            });
            const accessToken = token.createToken(user);
            return accessToken;
        } catch (error) {
            console.log('UserService register :: ', error);
            throw new Error('Unable to create User!');
        }
    }

    /**
     *
     * @param email
     * @param password
     * @returns
     */
    public async login(
        email: string,
        password: string
    ): Promise<string | Error> {
        try {
            const user = await this.user.findOne({ email });
            if (!user) {
                throw new Error(
                    'Unable to find user with the given Email Address!'
                );
            }
            if (await user.isValidPassword(password)) {
                return token.createToken(user);
            } else {
                throw new Error('Invalid credentials!');
            }
        } catch (error) {
            throw new Error('Error finding User!');
        }
    }
}

export default UserService;
