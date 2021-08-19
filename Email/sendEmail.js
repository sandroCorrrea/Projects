const nodemailer = require('nodemailer');
const express = require('express');

var sendEmail = (destinatario, ) => {
    //CRIANDO TRANSPORTADOR
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: 'jsandro800@gmail.com',
            pass: 'scrj123456',
        }
    });

    let menssage = await transporter.sendMail({
        from: '"AGENDA CONTABILIDADE" <jsandro800@gmail.com>', //PESSOA QUE ESTA ENVIANDO
        to: destinatario, //PESSOA PARA QUEM ESTA ENVIANDO ESTA ENVIANDO
        subject: "CONFIRMAÇÃO DE CONTA COMO ADMINISTRADOR!",
        text: "Nós da Agenda Contabilidade temos orgulho de anunciar você como novo Administrador",
        html: "<h1>Teste com Html</h1>",

    });
};

module.exports = sendEmail;