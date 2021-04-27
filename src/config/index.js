export const isDev = process.env.NODE_ENV !== 'production';

export const HOST_URL = `https://opensource.hcltechsw.com`;
export const BASE_PATH_URL = 'volt-mx-tutorials';

export const GITHUB_NAME = 'HCL-TECH-SOFTWARE';

export const SERVER = isDev ? 'https://localhost:3200' : `${HOST_URL}/${BASE_PATH_URL}`;
