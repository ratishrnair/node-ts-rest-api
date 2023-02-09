import { cleanEnv, str, port } from 'envalid';

function validateEnv() {
    cleanEnv(process.env, {
        NODE_ENV: str({
            choices: ['production', 'development'],
        }),
        MONGO_PATH: str(),
        MONGO_PASSWORD: str(),
        MONGO_USER: str(),
        PORT: port({ default: 3000 }),
        JWT_SECRET: str(),
    });
}

export default validateEnv;
