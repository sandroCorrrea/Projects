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

    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: 'jsandro800@gmail.com',
            pass: 'scrj123456',
        }
    });

    let menssage = transporter.sendMail({
        from: '"AGENDA CONTABILIDADE" <jsandro800@gmail.com>', //PESSOA QUE ESTA ENVIANDO
        to: email, //PESSOA PARA QUEM ESTA ENVIANDO ESTA ENVIANDO
        subject: "Olá " + name + " sua conta como administrador foi confirmada pela Agenda Contabilidade ! :)" ,
        attachments: [{
            filename: 'logo.png',
            path: 'public/img/logo.png',
            cid: 'unique@nodemailer.com' //same cid value as in the html img src
        }],
        html: ` <!doctype html>
        <html ⚡4email>
          <head>
            <meta charset="utf-8">
            <style amp4email-boilerplate>body{visibility:hidden}</style>
            <script async src="https://cdn.ampproject.org/v0.js"></script>
            <script async custom-element="amp-anim" src="https://cdn.ampproject.org/v0/amp-anim-0.1.js"></script>
          </head>
          <body style="color: #0596f9">
              <h1>AGENDA CONTABILIDADE.</h1>
              <br>
              <h4><b>Assunto</b>: Temos um grande orgulho em nomear você como um novo administrador da nossa plataforma!
              faça um bom uso.</h4>
              <hr>
              <img src="cid:unique@nodemailer.com" alt="Agenda Contabilidade" style="margin-right: 15vh">
              <hr>
              <footer background-color="#afb5c5"">
                <h3><b>Contato</b>              Telefone: (33)3321-4763         Email: contabilidadeagenda@gmail.com</h3>
                <hr>
              </footer>
          </body>
        </html>`,
    });

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

router.get('/logout', (req, res) => {
    req.session.user == undefined;
    res.redirect('/');
});

module.exports = router;