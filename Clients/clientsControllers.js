const express = require('express');
const router = express.Router();
const Customer = require('./Customer');
const Category = require('../Categories/Category');
const Admin = require('../Admin/AdminModel');
const slugify = require('slugify');
const bcrypt = require('bcryptjs');
const adminAuth = require('../middlewares/adminAuth');

router.get('/admin/clients/new', adminAuth, (req, res) => {
    Category.findAll().then(categories => {
        if (categories != undefined) {
            Admin.findAll().then(admins => {
                res.render('admin/clients/new', {
                    categories: categories,
                    admins: admins,
                })
            });
        } else {
            res.redirect('/admin/clients/new');
        }
    }).catch(erro => {
        res.redirect('/admin/clients/new');
    });
});

router.post('/admin/clients/save', adminAuth, (req, res) => {
    var categoryId = req.body.categoryId;
    var name = req.body.name;
    var cpf = req.body.cpf;
    var dathBirth = req.body.dathBirth;
    var email = req.body.email;
    var phone = req.body.phone;
    var address = req.body.address;
    var adminId = req.body.adminId;
    var password = req.body.password;
    var confirmPassword = req.body.confirmPassword;

    if (password != confirmPassword) {
        res.redirect('/admin/erro/password');
    } else {
        Customer.findOne({
            where: { email: email }
        }).then(user => {
            if (user == undefined) {
                var salt = bcrypt.genSaltSync(10);
                var hash = bcrypt.hashSync(password, salt);
                Customer.create({
                    categoryId: categoryId,
                    name: name,
                    slug: slugify(name),
                    cpf: cpf,
                    dathBirth: dathBirth,
                    email: email,
                    phone: phone,
                    address: address,
                    adminId: adminId,
                    password: hash,
                }).then(() => {
                    res.redirect('/admin/clients/show');
                }).catch(erro => {
                    res.redirect('/');
                });
            } else {
                res.redirect('/admin/erro/email');
            }
        })
    }
});

router.get('/admin/clients/show', adminAuth, (req, res) => {

    Customer.findAll({
        include: [{ model: Category }],
    }).then(clients => {
        if (clients != undefined) {
            Admin.findAll().then(admins => {
                res.render('admin/clients/show', {
                    clients: clients,
                    admins: admins
                });
            });
        } else {
            res.redirect('/');
        }
    });
});

router.post('/admin/clients/delete', adminAuth, (req, res) => {
    var id = req.body.id;

    if (isNaN(id)) {
        res.redirect('/admin/clients/show');
    }
    Customer.destroy({
        where: { id: id }
    }).then(clients => {
        if (clients != undefined) {
            res.redirect('/admin/clients/show');
        } else {
            res.redirect('/');
        }
    }).catch(erro => {
        res.redirect('/');
    });
});

router.get('/admin/clients/edit/:id', adminAuth, (req, res) => {
    var id = req.params.id;
    Customer.findByPk(id).then(clients => {
        if (clients != undefined) {
            Admin.findAll().then(admins => {
                Category.findAll().then(categories => {
                    res.render('admin/clients/edit', {
                        clients: clients,
                        admins: admins,
                        categories: categories
                    });
                })
            });
        } else {
            res.redirect('/admin/clients/show');
        }
    }).catch(erro => {
        res.redirect('/admin/clients/show');
    });
});

router.post('/admin/clients/update', adminAuth, (req, res) => {
    var name = req.body.name;
    var cpf = req.body.cpf;
    var dathBirth = req.body.dathBirth;
    var email = req.body.email;
    var phone = req.body.phone;
    var address = req.body.address;
    var adminId = req.body.adminId;
    var categoryId = req.body.categoryId;
    var id = req.body.id;
    var password = req.body.password;

    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(password, salt);

    Customer.update({
        name: name,
        slug: slugify(name),
        cpf: cpf,
        dathBirth: dathBirth,
        email: email,
        phone: phone,
        address: address,
        adminId: adminId,
        categoryId: categoryId,
        password: hash,
    }, {
        where: { id: id }
    }).then(() => {
        res.redirect('/admin/clients/show');
    }).catch(erro => {
        res.redirect('/');
    });
});

router.get('/admin/erro/password', adminAuth, (req, res) => {
    res.render('event/passwordErro');
});

router.get('/admin/erro/email', adminAuth, (req, res) => {
    res.render('event/email');
});

router.get('/client/erro/password', (req, res) => {
    res.render('event/passwordErroClient');
});

router.get('/client/erro/email', (req, res) => {
    res.render('event/emailClient');
});

router.get('/client/login', (req, res) => {
    res.render('admin/clients/login')
});

router.post('/user/clients/authenticate', (req, res) => {
    var email = req.body.email;
    var password = req.body.password;

    Customer.findOne({
        where: {
            email: email
        }
    }).then(client => {
        if (client != undefined) {
            var correct = bcrypt.compareSync(password, client.password);
            if (correct) {
                req.session.client = {
                    email: req.session.email,
                    password: req.session.password,
                }
                res.send('Usuário Cadastrado com sucesso!!');
            } else {
                res.redirect('/client/erro/password');
            }
        } else {
            res.redirect('/client/erro/email');
        }
    }).catch(erro => {
        res.redirect('/');
    });
});

router.get('/client/new', (req, res) => {
    Category.findAll().then(category => {
        res.render('admin/clients/registerClient', {
            category: category,
        });
    });
});

router.post('/client/register/save', (req, res) => {
    var name = req.body.name;
    var cpf = req.body.cpf;
    var dathBirth = req.body.dathBirth;
    var email = req.body.email;
    var phone = req.body.phone;
    var address = req.body.address;
    var categoryId = req.body.categoryId;
    var password = req.body.password;
    var confirmPassword = req.body.confirmPassword;

    if (password != confirmPassword) {
        res.redirect('/client/erro/password');
    } else {
        Customer.findOne({
            where: { email: email }
        }).then(user => {
            if (user == undefined) {
                var salt = bcrypt.genSaltSync(10);
                var hash = bcrypt.hashSync(password, salt);
                Customer.create({
                    categoryId: categoryId,
                    name: name,
                    slug: slugify(name),
                    cpf: cpf,
                    dathBirth: dathBirth,
                    email: email,
                    phone: phone,
                    address: address,
                    password: hash,
                }).then(() => {
                    res.send('Tudo certo agora pode ir fazer suas atividades');
                }).catch(erro => {
                    res.redirect('/');
                });
            } else {
                res.redirect('/client/erro/email');
            }
        })
    }
});

module.exports = router;