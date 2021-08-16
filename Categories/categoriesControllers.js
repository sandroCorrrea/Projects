const express = require('express');
const router = express.Router();
const Category = require('./Category');
const slugify = require('slugify');
const adminAuth = require('../middlewares/adminAuth');

router.get('/admin/categories/new', adminAuth, (req, res) => {
    res.render('admin/categories/new');
});

router.post('/admin/categories/save', adminAuth, (req, res) => {
    var title = req.body.title;

    Category.create({
        title: title,
        slug: slugify(title),
    }).then(() => {
        res.redirect('/admin/categories/show');
    }).catch(erro => {
        res.redirect('/');
    });
});

router.get('/admin/categories/show', adminAuth, (req, res) => {
    Category.findAll().then(categories => {
        if (categories != undefined) {
            res.render('admin/categories/show', {
                categories: categories,
            });
        } else {
            res.redirect('/');
        }
    }).catch(erro => {
        res.redirect('/');
    });
});

router.post('/admin/categories/delete', adminAuth, (req, res) => {
    var id = req.body.id;

    if (isNaN(id)) {
        res.redirect('/admin/categories/show');
    }
    Category.destroy({
        where: { id: id }
    }).then(categories => {
        if (categories != undefined) {
            res.redirect('/admin/categories/show');
        } else {
            res.redirect('/admin/categories/show');
        }
    }).catch(erro => {
        res.redirect('/');
    });
});

router.get('/admin/categories/edit/:id', adminAuth, (req, res) => {
    var id = req.params.id;

    Category.findByPk(id).then(category => {
        if (category != undefined) {
            res.render('admin/categories/edit', {
                category: category,
            });
        } else {
            res.redirect('/admin/categories/show');
        }
    }).catch(erro => {
        res.redirect('/admin/categories/show');
    });
});

router.post('/admin/categories/update', adminAuth, (req, res) => {
    var title = req.body.title;
    var id = req.body.id;

    Category.update({ title: title, slug: slugify(title) }, {
        where: { id: id }
    }).then(category => {
        if (category != undefined) {
            res.redirect('/admin/categories/show');
        } else {
            res.redirect('/admin/categories/show');
        }
    }).catch(erro => {
        res.redirect('/admin/categories/show');
    });
});

module.exports = router;