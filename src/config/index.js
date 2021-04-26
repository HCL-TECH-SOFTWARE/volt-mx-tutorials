const dev = process.env.NODE_ENV !== 'production';

export const server = dev ? 'http://localhost:3200' : 'https://opensource.hcltechsw.com/volt-mx-tutorials/hikes';
