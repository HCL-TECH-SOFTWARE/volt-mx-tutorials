export const isDev = process.env.NODE_ENV !== 'production';

export const BASE_PATH_URL = 'volt-mx-tutorials';

export const SERVER = isDev ? 'http://localhost:3200' : `https://opensource.hcltechsw.com/${BASE_PATH_URL}`;
