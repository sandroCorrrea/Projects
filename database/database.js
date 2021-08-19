const { Sequelize } = require('sequelize');

// PARA USAR NO HEROKU
const database = new Sequelize('heroku_269701cb281c891', 'b910b09251433a', '01cec868', {
    host: 'us-cdbr-east-04.cleardb.com',
    dialect: 'mysql',
    timezone: '-03:00',
});

// PARA USAR NO Local
// const database = new Sequelize('agenda', 'root', 'scrj123456', {
//     host: 'localhost',
//     dialect: 'mysql',
//     timezone: '-03:00',
// });


module.exports = database;