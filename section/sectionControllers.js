const express = require('express');
const router  = express.Router();
const Article = require('../article/ArticleModel');
const Section = require('./Section');
const slugify = require('slugify');
const authAdmin = require('../middleware/adminAuth');

router.get('/admin/section/new', authAdmin, (req, res) => {

    Article.findAll().then(articles => {
        res.render('admin/section/new', {
            articles: articles,
        });
    })
});

router.post('/admin/section/save', (req, res) => {
    var title         = req.body.title;
    var corpo         = req.body.corpo;
    var articleSelect = req.body.articleSelect;

    Section.create({
        title: title,
        slug: slugify(title),
        body: corpo,
        articleId: articleSelect,
    }).then(() => {
        res.redirect('/admin/section/show');
    });
});

router.get('/admin/section/show', authAdmin, (req, res) => {

    Section.findAll({
        include: [{model: Article, required: true}]
    }).then(sections => {
        if (sections != undefined)
        {
            res.render('admin/section/show', {
                sections: sections
            });
        }
        else
        {
            res.redirect('/admin/section/show');
        }
    }).catch(erro => {
        res.redirect('/admin/section/show');
    }) 
});

router.post('/admin/section/delete', (req, res) => {
    var id = req.body.id;
    
    if (id != undefined)
    {
        if (!isNaN(id))
        {
            Section.destroy({
                where: {id: id}
            }).then(() => {
                res.redirect('/admin/section/show');
            })
        }
        else
        {
            res.redirect('/admin/section/show');
        }
    }
    else
    {
        res.redirect('/admin/section/show');
    }
});

router.get('/admin/section/edit/:id', authAdmin, (req, res) => {
    var id = req.params.id;

    Section.findByPk(id).then(sections => {
        if (sections != undefined)
        {
            Article.findAll().then(articles => {
                res.render('admin/section/edit', {
                    sections: sections,
                    articles: articles,
                })
            });
        }
        else
        {
            res.redirect('/admin/section/show');
        }
    }).catch(erro => {
        res.redirect('/admin/section/show');
    });
});

router.post('/admin/section/update', (req, res) => {
    var id        = req.body.id;
    var articleId = req.body.articleSelect;
    var title     = req.body.title;
    var body      = req.body.corpo;

    Section.update({title: title, slug: slugify(title), body: body, articleId: articleId}, {
        where: {id: id}
    }).then(() => {
        res.redirect('/admin/section/show')
    }).catch(erro => {
        res.redirect('/');
    });
});

router.get('/admin/section/page/:num', authAdmin, (req, res) => {
    var num    = req.params.num;
    var offset = 0;

    if (isNaN(offset) || offset == 1)
    {
        offset = 0;
    }
    else
    {
        offset = parseInt(num - 1) * 2;
    }

    Section.findAndCountAll({
        limit: 2,
        offset: offset,
    }).then(sections => {

        var pageNew;
        
        if (offset + 2 >= sections.count) 
        {
            pageNew = false;    
        }
        else
        {
            pageNew = true;
        }

        var result = {
            sections: sections,
            pageNew: pageNew,
            num: parseInt(num),
        }

        Article.findAll().then(articles => {
            res.render('admin/section/page', {
                result: result,
                articles: articles,
            })
        })
    });

});


module.exports = router;