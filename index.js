const express            = require('express');
const app                = express();
const bodyParser         = require('body-parser');
const connection         = require('./database/database');
const session            = require('express-session');

const Article            = require('./article/ArticleModel');
const Section            = require('./section/Section');
const User               = require('./users/User');

const articleControllers = require('./article/ArticleControllers');
const sectionControllers = require('./section/sectionControllers');
const userControllers    = require('./users/usersControllers');

app.use(session({
    secret: 'qualquercoisa',
    cookie: {maxAge: 300000},
}))

//CONEXÃO COM O BANCO DE DADOS
connection.authenticate()
    .then(() => {
        console.log("Conexão com o BD feita com Sucesso!");
    })
    .catch((msgErro) => {
        console.log(msgErro);
    })
//ENCERRANDO CONEXÃO COM O BANCO

app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use('/', articleControllers);
app.use('/', sectionControllers);
app.use('/', userControllers);

app.get('/', (req, res) => {
    Section.findAll({
        limit: 3
    }).then(sections => {
        if (sections != undefined)
        {
            Article.findAll().then(articles => {
                res.render('index', {
                    sections: sections,
                    articles: articles,
                })
            })
        }
        else
        {
            res.redirect('/');
        }
    }).catch(erro => {
        res.redirect('/');
    });
});

app.get('/:slug', (req, res) => {
    var slug = req.params.slug;
    Section.findOne({
        where: {slug: slug}
    }).then(sections => {
        if (sections != undefined)
        {
            Article.findAll().then(articles => {
                res.render('show', {
                    sections: sections,
                    articles: articles,
                })
            })
        }
    }).catch(erro => {
        res.redirect('/');
    })
});


app.listen(4000, (erro) => {
    if (erro)
    {
        console.log('ERRO!');
    }
    else
    {
        console.log('SUCESSO!');
    }
});