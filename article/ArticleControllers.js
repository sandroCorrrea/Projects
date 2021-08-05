const express = require('express');
const router  = express.Router();
const Article = require('./ArticleModel');
const slugify = require('slugify');
const authAdmin = require('../middleware/adminAuth');

router.get('/admin/article/new', authAdmin, (req, res) => {
    res.render('admin/article/new');
});

router.post('/admin/article/save', (req, res) => {
    var title = req.body.title;

    Article.create({
        title: title,
        slug: slugify(title)
    }).then(() => {
        res.redirect('/admin/article/show');
    })
});

router.get('/admin/article/show', authAdmin, (req, res) => {
    Article.findAll({
        raw: false,
    }).then(articles => {
        res.render('admin/article/show', {
            articles: articles,
        })
    })
});

router.post('/admin/article/delete', (req, res) => {
    var id = req.body.id;
    if (id != undefined)
    {
        if (!isNaN(id))
        {
            Article.destroy({
                where: {id: id}
            }).then(() => {
                res.redirect('/admin/article/show');
            })
        }
        else
        {
            res.redirect('/admin/article/show');
        }
    }
    else
    {
        res.redirect('/admin/article/show');
    }
});

router.get('/admin/article/edit/:id', authAdmin, (req, res) => {
    var id = req.params.id;

    if (isNaN(id))
    {
        res.redirect('/admin/article/show');
    }
    Article.findByPk(id).then(articles => {
        if (articles != undefined)
        {
            res.render('admin/article/edit', {
                articles: articles
            });
        }
        else
        {
            res.redirect('/admin/article/show');
        }
    }).catch(msgErro => {
        res.redirect('/admin/article/show');
    })
})

router.post('/admin/article/update', (req, res) => {
    var id = req.body.id;
    var title = req.body.title;

    Article.update({title: title, slug: slugify(title)}, {
        where: {id: id}
    }).then(() => {
        res.redirect('/admin/article/show');
    })
});

module.exports = router;