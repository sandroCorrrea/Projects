const express = require('express');
const router = express.Router();
const Admin = require('./AdminModel');
const slugify = require('slugify');
const bcrypt = require('bcryptjs');
const adminAuth = require('../middlewares/adminAuth');
const nodemailer = require('nodemailer');

router.get('/admin/new', adminAuth, (req, res) => {
    res.render('admin/templatesAdmin/new');
});

router.post('/admin/save/data', adminAuth, (req, res) => {
    var name = req.body.name;
    var cpf = req.body.cpf;
    var dathBirth = req.body.dathBirth;
    var email = req.body.email;
    var phone = req.body.phone;
    var address = req.body.address;
    var password = req.body.password;
    var confirmPassword = req.body.confirmPassword;


    if (password != confirmPassword) {
        res.redirect('/admin/erro/password');
    } else {
        Admin.findOne({
            where: { email: email }
        }).then(user => {
            if (user == undefined) {
                var salt = bcrypt.genSaltSync(10);
                var hash = bcrypt.hashSync(password, salt);
                Admin.create({
                    name: name,
                    slug: slugify(name),
                    cpf: cpf,
                    dathBirth: dathBirth,
                    email: email,
                    phone: phone,
                    address: address,
                    password: hash,
                }).then(() => {
                    res.redirect('/admin/show');
                }).catch(erro => {
                    res.redirect('/admin/show');
                });
            } else {
                res.redirect('/admin/erro/email');
            }
        });
    }
});

router.get('/admin/show', adminAuth, (req, res) => {
    Admin.findAll().then(admins => {
        if (admins != undefined) {
            res.render('admin/templatesAdmin/show', {
                admins: admins,
            });
        } else {
            res.redirect('/admin/show');
        }
    }).catch(erro => {
        res.redirect('/admin/show');
    });
});

router.post('/admin/delete', adminAuth, (req, res) => {
    var id = req.body.id;

    if (isNaN(id)) {
        res.redirect('/admin/show');
    }

    Admin.destroy({
        where: { id: id }
    }).then(admins => {
        if (admins != undefined) {
            res.redirect('/admin/show');
        } else {
            res.redirect('/admin/show');
        }
    }).catch(erro => {
        res.redirect('/admin/show');
    });
});

router.get('/admin/edit/:id', adminAuth, (req, res) => {
    var id = req.params.id;

    Admin.findByPk(id).then(admins => {
        if (admins != undefined) {
            if (!isNaN(id)) {
                res.render('admin/templatesAdmin/edit', {
                    admins: admins,
                })
            } else {
                res.redirect('/admin/show');
            }
        } else {
            res.redirect('/admin/show');
        }
    }).catch(erro => {
        res.redirect('/admin/show');
    });
});

router.post('/admin/update', adminAuth, (req, res) => {
    var name = req.body.name;
    var cpf = req.body.cpf;
    var dathBirth = req.body.dathBirth;
    var email = req.body.email;
    var phone = req.body.phone;
    var address = req.body.address;
    var id = req.body.id;
    var password = req.body.password;

    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(password, salt);

    Admin.update({
        name: name,
        slug: slugify(name),
        cpf: cpf,
        dathBirth: dathBirth,
        email: email,
        phone: phone,
        address: address,
        password: hash,
    }, {
        where: { id: id }
    }).then(admins => {
        if (admins != undefined) {
            res.redirect('/admin/show');
        } else {
            res.redirect('/admin/show');
        }
    }).catch(erro => {
        res.redirect('/admin/show');
    });
});

router.get('/admin/erro/password', adminAuth, (req, res) => {
    res.render('event/passwordErro');
});

router.get('/admin/erro/email', adminAuth, (req, res) => {
    res.render('event/email');
});

router.get('/user/login', (req, res) => {
    res.render('users/adminLogin');
});

router.post('/user/authenticate', (req, res) => {
    var email = req.body.email;
    var password = req.body.password;

    Admin.findOne({
        where: { email: email }
    }).then(users => {
        if (users != undefined) {
            var correct = bcrypt.compareSync(password, users.password);
            if (correct) {
                req.session.user = {
                    email: req.session.email,
                    password: req.session.password
                }
                res.redirect('/admin/categories/show');
            } else {
                res.redirect('/user/login');
            }
        } else {
            res.redirect('/user/login');
        }
    })
});

router.get('/nodemailer', (req, res) => {
    let trasnporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: 'jsandro800@gmail.com',
            pass: 'scrj123456',
        }
    });

    trasnporter.sendMail({
        from: 'Agenda Contabilidade <jsandro800@gmail.com>',
        to: 'jsandro800@gmail.com',
        subject: 'Olá Somos a Agenda Contabilidade e estamos te mandando um email Teste',
        text: 'Lorem Ipsum é simplesmente uma simulação de texto da indústria tipográfica e de impressos, e vem sendo utilizado desde o século XVI, quando um impressor desconhecido pegou uma bandeja de tipos e os embaralhou para fazer um livro de modelos de tipos. Lorem Ipsum sobreviveu não só a cinco séculos, como também ao salto para a editoração eletrônica, permanecendo essencialmente inalterado. Se popularizou na década de 60, quando a Letraset lançou decalques contendo passagens de Lorem Ipsum, e mais recentemente quando passou a ser integrado a softwares de editoração eletrônica como Aldus PageMaker.',
        html: '<h1 style="text-aling: center";>Teste com HTML </h1><b>Testo em negrito</b>',
        amp: ""
    }).then(message => {
        console.log(message);
    }).catch(erro => {
        console.log(erro);
    });

    res.send('Mandamos o email');
});


router.get('/logout', (req, res) => {
    req.session.user == undefined;
    res.redirect('/');
});

module.exports = router;