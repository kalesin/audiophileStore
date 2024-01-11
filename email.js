function sendMail(mailOptions, isOrderEmail) {
    const hbs = require('nodemailer-express-handlebars')
    //const hbs = require('express-handlebars');
    const nodemailer = require('nodemailer')
    const path = require('path')
    // initialize nodemailer
    console.log(process.env);
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.CREDENTIALS_USER,
            pass: process.env.CREDENTIALS_PASS
        }
    });
    // point to the template folder
    const handlebarOptions = {
        viewEngine: {
            partialsDir: path.resolve('./views/'),
        },
        viewPath: path.resolve('./views/'),
    };
    //switch layout to orderEmail and add helper function for generating html list
    if (isOrderEmail) {
        handlebarOptions.viewEngine.defaultLayout = "./views/layouts/orderEmail"
        //handlebarOptions.helpers = require('./handlebars-helpers').helpers;
    } else {
        handlebarOptions.viewEngine.defaultLayout = false;
    }
    // use a template file with nodemailer
    transporter.use('compile', hbs(handlebarOptions))
    // trigger the sending of the E-mail
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);
    });

}
exports.sendMail = sendMail;