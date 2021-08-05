const express = require('express');
const router  = express.Router();
const bcrypt  = require('bcryptjs');
const User    = require('./User');
const auth    = require('../middleware/adminAuth');

router.get('/admin/users/new', auth, (req, res) => {
    res.render('admin/user/user');
});

router.post('/admin/users/save', (req, res) => {
    var email = req.body.email;
    var password = req.body.password;

    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(password, salt);

    User.findOne({
        where: {email: email}
    }).then(users => {
        if (users == undefined) 
        {
            User.create({
                email: email,
                password: hash,
            }).then(() => {
                res.redirect('/admin/users/show');
            }).catch(erro => {
                res.redirect('/');
            });    
        }
        else
        {
            res.redirect('/admin/users/new');
        }
    })
});

router.get('/admin/users/show', (req, res) => {
    User.findAll().then(users => {
        if (users != undefined) 
        {
            res.render('admin/user/show',{
                users: users
            });
        }
        else
        {
            res.redirect('/');
        }
    }).catch(erro => {
        res.redirect('/');
    });
});

router.get('/admin/user/login', (req, res) => {
    res.render('admin/user/login')
});

router.post('/admin/user/authentication', (req, res) => {
    var email = req.body.email;
    var password = req.body.password;

    User.findOne({
        where: {email: email}
    }).then(user => {
        if (user != undefined)
        {
            var confirm = bcrypt.compareSync(password, user.password);
            if (confirm) {
                req.session.user = {
                    id: user.id,
                    email: user.email,
                }
                res.redirect('/admin/article/show');
            }
            else
            {
                res.redirect('/admin/user/login');
            }
        }
        else
        {
            res.redirect('/admin/user/login');
        }
    }).catch(erro => {
        res.redirect('/');
    });
});

router.get('/logout', (req, res) => {
    req.session.user = undefined;
    res.redirect('/');
});


module.exports = router;