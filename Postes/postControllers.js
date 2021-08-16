const express = require('express');
const router = express.Router();
const slugify = require('slugify');
const Post = require('./Post');
const adminAuth = require('../middlewares/adminAuth');

router.get('/admin/post/new', adminAuth, (req, res) => {
    res.render('admin/posts/new');
});

router.post('/admin/post/save', adminAuth, (req, res) => {
    var title = req.body.title;
    var body = req.body.body;

    Post.create({
        title: title,
        slug: slugify(title),
        body: body,
    }).then(() => {
        res.redirect('/admin/post/show');
    }).catch(erro => {
        res.redirect('/');
    });
});

router.get('/admin/post/show', adminAuth, (req, res) => {
    Post.findAll().then(post => {
        if (post != undefined) {
            res.render('admin/posts/show', {
                post: post
            });
        } else {
            res.redirect('/');
        }
    }).catch(erro => {
        res.redirect('/');
    });
});

router.post('/admin/post/delete', adminAuth, (req, res) => {
    var id = req.body.id;

    Post.destroy({
        where: { id: id }
    }).then(post => {
        if (post != undefined) {
            if (!isNaN(id)) {
                res.redirect('/admin/post/show');
            } else {
                res.redirect('/admin/post/show');
            }
        } else {
            res.redirect('/admin/post/show');
        }
    }).catch(erro => {
        res.redirect('/admin/post/show');
    });
});

router.get('/admin/post/edit/:id', adminAuth, (req, res) => {
    var id = req.params.id;

    if (isNaN(id)) {
        res.redirect('/admin/post/show');
    }
    Post.findByPk(id).then(posts => {
        if (posts != undefined) {
            res.render('admin/posts/edit', {
                posts: posts,
            })
        } else {
            res.redirect('/admin/post/show');
        }
    }).catch(erro => {
        res.redirect('/admin/post/show');
    });
});

router.post('/admin/post/update', adminAuth, (req, res) => {
    var title = req.body.title;
    var body = req.body.body;
    var id = req.body.id;

    Post.update({ title: title, slug: slugify(title), body: body }, {
        where: { id: id }
    }).then(() => {
        res.redirect('/admin/post/show');
    }).catch(erro => {
        res.redirect('/admin/post/show');
    })
});

module.exports = router;