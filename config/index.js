const {knex }= require('knex')
const config={
    options:{
        client: 'mysql',
            connection:{
                host: '127.0.0.1',
                user: 'root',
                password: 'password',
                database: 'ecommerce'
            }
        }
};

const connectionDataBase = knex(config.options);
module.exports = connectionDataBase