export const isDev = process.env.NODE_ENV !== 'production';
export const DEV_PORT = 3200;
export const BASE_BRANCH = 'voltformula-hikes';

export const HOST_URL = `https://rusty-godwin-hcl.github.io`;
export const BASE_PATH_URL = 'volt-mx-tutorials';

export const GITHUB_NAME = 'rusty-godwin-hcl';

export const SERVER = isDev ? `http://localhost:${DEV_PORT}` : `${HOST_URL}/${BASE_PATH_URL}`;
