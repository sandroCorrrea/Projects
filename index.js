const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const database = require('./database/database');
const session = require('express-session');

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//SESSÃO DE LOGIN
app.use(session({
    secret: 'sanjdnçjnscdnakcmndsafmdkmckasnsinvfnf',
    cookie: { maxAge: 10800000 },
}))

//CONTROLLERS
const categoriesControllers = require('./Categories/categoriesControllers');
const clientsControllers = require('./Clients/clientsControllers');
const adminControllers = require('./Admin/adminControllers');
const postControllers = require('./Postes/postControllers');

//MODELS
const Category = require('./Categories/Category');
const Customer = require('./Clients/Customer');
const Admin = require('./Admin/AdminModel');
const Post = require('./Postes/Post');

//ROTAS
app.use('/', categoriesControllers);
app.use('/', clientsControllers);
app.use('/', adminControllers);
app.use('/', postControllers);

//CONEXÃO COM O BANCO DE DADOS
database.authenticate()
    .then(() => {
        console.log('CONEXAO COM O BD FEITA');
    })
    .catch(erro => {
        console.log(erro);
    });

app.get('/', (req, res) => {
    Post.findAll().then(posts => {
        res.render('index', {
            posts: posts,
        });
    });
});

var porta = process.env.PORT || 8080;

app.listen(porta, (erro) => {
    if (erro) {
        console.log('ERRO!');
    } else {
        console.log('SUCESSO!');
    }
});