require('dotenv').config();

export const Environment = {
    port: process.env.PORT,
    db_type: process.env.DB_TYPE,
};
