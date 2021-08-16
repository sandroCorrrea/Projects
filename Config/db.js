if (process.env.NODE_ENV == 'production') {
    module.exports = { mysql: '//b910b09251433a:01cec868@us-cdbr-east-04.cleardb.com/heroku_269701cb281c891?reconnect=true' };
} else {
    console.log('Erro no banco de dados');
}