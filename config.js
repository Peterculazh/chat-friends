import DB from './ormconfig.json';
const dev = process.env.NODE_ENV === 'dev';

const config = {
    jwtSecret: "test",
    dev,
    port: dev ? 3000 : 8000,
    db: DB
}

export default config;