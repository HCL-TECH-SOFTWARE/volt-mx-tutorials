export const isDev = process.env.NODE_ENV !== 'production';
export const DEV_PORT = 3200;
export const BASE_BRANCH = 'phx-dev';

export const HOST_URL = `https://opensource.hcltechsw.com`;
export const BASE_PATH_URL = 'volt-mx-tutorials';

export const GITHUB_NAME = 'HCL-TECH-SOFTWARE';

export const SERVER = isDev ? `https://localhost:${DEV_PORT}` : `${HOST_URL}/${BASE_PATH_URL}`;
