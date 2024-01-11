require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3001;

//const images = require('./images')

//client
app.use('/', express.static('./client/dist'))
const routes = ['/', '/home', '/headphones', '/earphones', '/speakers', '/address', '/reset', '/checkout', '/success']
app.get(routes, (req, res) => {
    res.sendFile('client/dist/index.html', { root: __dirname });
});

app.use(
    express.urlencoded({
        extended: true,
    })
)
app.use(express.json())

app.use((req, res, next) => {
    res = res.header("Access-Control-Allow-Origin", "*")
    res = res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested, Content-Type, Accept, Authorization, Access-Control-Allow-Origin"
    )
    if (req.method === "OPTIONS") {
        res = res.header(
            "Access-Control-Allow-Methods",
            "POST, PUT, PATCH, GET, DELETE"
        )
        return res.status(200).json({})
    }
    next()
})

//log all database, credentials, stipe secrets saved in process.env
console.log(process.env);
//use specific port
app.listen(port, () => console.log(`Listening on port ${port}`))

//stripe
const stripe = require('stripe')(process.env.STRIPE_TEST_SK);

app.get('/secret', async (request, response) => {
    const token = request.query.token;
    const cart = JSON.parse(request.query.cart);
    const tokenType = false;
    const productPrices = {
        "YX1 WIRELESS EARPHONES": 3999,
        "ZX9 SPEAKER": 44999,
        "ZX7 SPEAKER": 34999,
        "XX99 MARK II HEADPHONES": 11999,
        "XX99 MARK I HEADPHONES": 9999,
        "XX59 HEADPHONES": 7999
    }
    const { prices } = { prices: cart.map(a => productPrices[a.name] * a.amount) };
    const totalPrice = prices.length != 0 ? prices.reduce((x, y) => x + y) : 0;
    const grandTotal = totalPrice > 15000 ? totalPrice : totalPrice + 1500;

    let retrieveToken = await db.findToken(token, tokenType);
    let checkIfTokenIsValid = await db.checkToken(token, tokenType);
    if (retrieveToken) {
        if (checkIfTokenIsValid) {
            const paymentIntent = await stripe.paymentIntents.create({
                amount: grandTotal,
                currency: 'eur',
                automatic_payment_methods: { enabled: true },
            });
            if (paymentIntent) {
                response.json({ client_secret: paymentIntent.client_secret });
            } else {
                response.status(400).send(`Couldn't create payment intent`);
            }
        } else {
            response.status(400).send(`Token has expired!`);
        }
    } else {
        response.status(400).send(`Can't find token in database!`);
    }
});

const endpointSecret = 'whsec_...';

app.post('/webhook', express.raw({ type: 'application/json' }), (request, response) => {
    let event = request.body;
    if (endpointSecret) {
        const signature = request.headers['stripe-signature'];
        try {
            event = stripe.webhooks.constructEvent(
                request.body,
                signature,
                endpointSecret
            );
        } catch (err) {
            console.log(`⚠️  Webhook signature verification failed.`, err.message);
            return response.sendStatus(400);
        }
    }
    switch (event.type) {
        case 'payment_intent.succeeded':
            const paymentIntent = event.data.object;
            console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);
            // Then define and call a method to handle the successful payment intent.
            // handlePaymentIntentSucceeded(paymentIntent);
            break;
        case 'payment_method.attached':
            const paymentMethod = event.data.object;
            // Then define and call a method to handle the successful attachment of a PaymentMethod.
            // handlePaymentMethodAttached(paymentMethod);
            break;
        default:
            console.log(`Unhandled event type ${event.type}.`);
    }
    // Return a 200 response to acknowledge receipt of the event
    response.send();
});

//data
const db = require('./queries')

//helpers
app.post('/register', async (request, response) => {
    const { username, password } = request.body;

    const emailRegex =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    //8 characters, 1 upper, 1 number
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    let validUsername = emailRegex.test(username);
    let validPassword = passwordRegex.test(password);
    let validInput = validUsername && validPassword;

    let user = null;
    if (validInput) {
        user = await db.getUser(username);
    } else {
        response.status(400).send(`Invalid input!`)
    }

    if (!user) {
        let register = await db.registerUser(username, password)
        console.log('register', register)
        if (register) {
            response.status(200).json(register)
        } else {
            response.status(400).send(`Couldn't register user!`)
        }
    } else {
        response.status(400).send(`User with that email already exists!`)
    }
})


app.post('/login', async (request, response) => {
    const { username, password } = request.body;
    const tokenType = false;

    const emailRegex =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    //8 characters, 1 upper, 1 number
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

    let validUsername = emailRegex.test(username);
    let validPassword = passwordRegex.test(password);
    let validInput = validUsername && validPassword;

    let user = null;
    let samePasswords = null;

    if (validInput) {
        user = await db.getUser(username)
        samePasswords = await db.comparePasswords(password, user.hash)
    } else {
        response.status(400).send(`Invalid input!`)
    }

    if (user) {
        if (samePasswords) {
            let tokenExists = await db.findTokenByUser(username, tokenType)
            if (tokenExists) {
                let removeOldToken = await db.removeToken(tokenExists.token, tokenType)
                if (!removeOldToken) {
                    response.status(400).send(`Couldn't delete old token!`)
                }
            }
            let addTokenToDb = await db.addToken(user.id, username, tokenType)
            if (addTokenToDb) {
                response.status(200).json(addTokenToDb);
            } else {
                response.status(400).send(`Couldn't add token to database!`)
            }
        } else {
            response.status(400).send(`Passwords don't match!`)
        }
    } else {
        response.status(400).send(`Can't find user in database!`)
    }
})

app.post('/logout', async (request, response) => {
    const token = request.body.token;
    const tokenType = false;

    let tokenExists = await db.findToken(token, tokenType)
    if (tokenExists) {
        let deleteToken = await db.removeToken(token, tokenType)
        if (deleteToken) {
            response.status(200).json(deleteToken);
        } else {
            response.status(400).send(`Couldn't delete token!`)
        }
    } else {
        response.status(400).send(`Can't find token in database!`)
    }
    /* db.findToken(token).then(res => {
        return db.removeToken(token)
    }).then(res => {
        response.status(200)
    }).catch(err => {
        throw err
    }) */
})

app.get('/token', async (request, response) => {
    const token = request.query.token;
    const tokenType = false;

    let retrieveToken = await db.findToken(token, tokenType);
    if (retrieveToken) {
        let checkIfTokenIsValid = await db.checkToken(token, tokenType);
        if (checkIfTokenIsValid) {
            response.status(200).json(retrieveToken);
        } else {
            response.status(400).send(`Token has expired!`);
        }
    } else {
        response.status(400).send(`Can't find token in database!`);
    }
})

app.post('/order', async (request, response) => {
    const { order_total, shipping_address, items, username } = request.body;
    const { phone, name, address, city, zip, country } = shipping_address;
    const { billing_address } = request.body;
    let user = await db.getUser(username)
    if (user) {
        const payment_received = false;
        const email_sent = false;
        let order = await db.addOrder(username, payment_received, email_sent, order_total)
        if (order) {
            const order_id = order.id;
            //const order_id = { order_id: order.id }
            for (let i = 0; i < items.length; i++) {
                const item_name = Object.keys(items[i])[0];
                const item_amount = Object.values(items[i])[0];
                let addItem = await db.addItem(order_id, item_name, item_amount)
                if (!addItem) {
                    response.status(400).send(`Can't add ordered items to database!`);
                }
            }
            if (!billing_address) {
                let shippingAddress = await db.addAddress(order.id, true, phone, name, address, zip, city, country);
                if (shippingAddress) {
                    response.status(200).json({ order_id: order_id })
                } else {
                    response.status(400).send(`Can't add shipping address to database!`);
                }
            } else {
                let shippingAddress = await db.addAddress(order.id, true, phone, name, address, zip, city, country);
                let billingAddress = await db.addAddress(order.id, false, billing_address.phone, billing_address.name, billing_address.address, billing_address.zip, billing_address.city, billing_address.country)
                if (shippingAddress && billingAddress) {
                    response.status(200).json({ order_id: order_id })
                } else {
                    response.status(400).send(`Can't add shipping and billing address to database!`);
                }
            }
        } else {
            response.status(400).send(`Can't create order in database!`);
        }
    } else {
        response.status(400).send(`Can't find user in database!`);
    }
})

app.post('/changepassword', async (request, response) => {
    const { token, oldpassword, password } = request.body;

    let tokenExists = await db.findToken(token);
    if (tokenExists) {
        let user = await db.getUser(tokenExists.username)
        if (user) {
            let checkOldPassword = await db.comparePasswords(oldpassword, user.hash)
            if (checkOldPassword) {
                let changePassword = await db.updatePassword(tokenExists.username, password)
                if (changePassword) {
                    let deleteToken = await db.removeToken(token)
                    if (deleteToken) {
                        response.status(200).json(deleteToken);
                    } else {
                        response.status(400).send(`Couldn't delete token!`);
                    }
                } else {
                    response.status(400).send(`Couldn't update password!`);
                }
            } else {
                response.status(400).send(`Old password doesn't match!`);
            }
        } else {
            response.status(400).send(`Can't find user in database!`);
        }
    } else {
        response.status(400).send(`Can't find token in database!`);
    }
})

app.post('/resetpassword', async (request, response) => {
    const { token, password } = request.body;
    const tokenType = true;

    let tokenExists = await db.findToken(token, tokenType);
    if (tokenExists) {
        let user = await db.getUser(tokenExists.username)
        if (user) {
            let changePassword = await db.updatePassword(tokenExists.username, password)
            let deleteToken = await db.removeToken(token, tokenType)
            if (changePassword) {
                if (deleteToken) {
                    response.status(200).json(deleteToken);
                } else {
                    response.status(400).send(`Couldn't delete token!`);
                }
            } else {
                response.status(400).send(`Couldn't update password!`);
            }
        } else {
            response.status(400).send(`Can't find user in database!`);
        }
    } else {
        response.status(400).send(`Can't find token in database!`);
    }
})

app.post('/email', async (request, response) => {
    const username = request.body.username;
    const tokenType = true;

    let user = await db.getUser(username)
    let tokenExists = await db.findTokenByUser(username, tokenType)
    if (user) {
        if (tokenExists) {
            let removeOldToken = await db.removeToken(tokenExists.token, tokenType)
            if (!removeOldToken) {
                response.status(400).send(`Couldn't delete old token!`)
            }
        }
        let resetToken = await db.addToken(user.id, username, tokenType)
        if (resetToken) {
            let { sendMail } = require('./email')
            const mailOptions = {
                from: '"Audiophile ltd." <kalesin.developer@gmail.com>',
                to: `${username}`,
                subject: 'Password reset for Audiophile',
                template: 'email',
                context: {
                    name: `${username}`,
                    address: `https://stormy-tundra-28859.herokuapp.com/reset?token=${resetToken.token}`
                }
            }
            const isOrderEmail = false;
            sendMail(mailOptions, isOrderEmail);
            response.status(200).send('Successfully sent reset email!')
        } else {
            response.status(400).send(`Can't generate reset pw token!`);
        }
    } else {
        response.status(400).send(`Can't find user in database!`);
    }
})

app.post('/orderemail', async (request, response) => {
    const { order_id } = request.body;
    //queries where you return all data, pass it to mail Options
    //create 2 different emails?
    console.log('index order_id', order_id)
    let order = await db.findOrder(order_id)
    console.log('index order', order)
    if (order) {
        let address = await db.findAddress(order_id)
        if (address) {
            let items = await db.findItem(order_id)
            if (items) {
                //set prices, shipping price, order_total and hosted images links
                const productPrices = {
                    "YX1 WIRELESS EARPHONES": 39.99,
                    "ZX9 SPEAKER": 449.99,
                    "ZX7 SPEAKER": 349.99,
                    "XX99 MARK II HEADPHONES": 119.99,
                    "XX99 MARK I HEADPHONES": 99.99,
                    "XX59 HEADPHONES": 79.99
                }
                const productImages = {
                    "YX1 WIRELESS EARPHONES": "https://i.imgur.com/QE0Zs6e.jpg",
                    "ZX9 SPEAKER": "https://i.imgur.com/oHb1xMO.jpg",
                    "ZX7 SPEAKER": "https://i.imgur.com/fJeosNb.jpg",
                    "XX99 MARK II HEADPHONES": "https://i.imgur.com/xlKuNX1.jpg",
                    "XX99 MARK I HEADPHONES": "https://i.imgur.com/ZQZ2too.jpg",
                    "XX59 HEADPHONES": "https://i.imgur.com/C7eb2pz.jpg"
                }
                /* const productImages = {
                    "YX1 WIRELESS EARPHONES": images[0],
                    "ZX9 SPEAKER": images[1],
                    "ZX7 SPEAKER": images[2],
                    "XX99 MARK II HEADPHONES": images[3],
                    "XX99 MARK I HEADPHONES": images[4],
                    "XX59 HEADPHONES": images[5]
                } */
                const { prices } = { prices: items.map(a => productPrices[a.item_name] * a.item_amount) };
                const totalPrice = prices.length != 0 ? prices.reduce((x, y) => x + y) : 0;
                const shippingPrice = totalPrice > 150 ? 0 : 15;
                for (let i = 0; i < items.length; i++) {
                    items[i].item_price = `${productPrices[items[i].item_name]} \$`;
                    items[i].item_image = `${productImages[items[i].item_name]}`;
                    /* items[i].item_name = items[i].item_name.toLowerCase().split(' ')
                        .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
                        .join(' '); */
                }
                console.log('address', address)
                console.log(address.name)
                let billing_address = null;
                let shipping_address = address[0];
                if(address.length > 1){
                    billing_address = address[1];
                }
                console.log('addresses', billing_address, shipping_address)
                //send mail
                let { sendMail } = require('./email')
                const mailOptions = {
                    from: '"Audiophile ltd." <kalesin.developer@gmail.com>',
                    to: order.username,
                    subject: `Order #${order_id} at Audiophile!`,
                    template: 'email',
                    context: {
                        order_id: order_id,
                        username: order.username,
                        address: shipping_address,
                        billing: billing_address,
                        items: items,
                        order_total: `${totalPrice+shippingPrice} \$`,
                        order_shipping: `${shippingPrice} \$`,
                    }
                }
                const isOrderEmail = true;
                sendMail(mailOptions, isOrderEmail);
                response.status(200).send('Successfully sent order email!')
            } else {
                response.status(400).send(`Can't find items in database!`)
            }
        } else {
            response.status(400).send(`Can't find address in database!`)
        }
    } else {
        response.status(400).send(`Can't find order in database!`)
    }

})

function submit() {
    const emailRegex =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    //8 characters, 1 upper, 1 number
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    let validUsername = emailRegex.test(username.value);
    let validPassword = passwordRegex.test(password.value);
    let passwordsMatch = password.value === passwordRepeat.value;
    let validInput = validUsername && validPassword && passwordsMatch;
    if (validInput) {
        store
            .dispatch("registerUser", {
                username: username.value,
                password: password.value,
            })
            .then((res) => {
                console.log(res);
                if (res.status == 400) {
                    repeatMsg.value = `${res.data}`;
                } else {
                    store.dispatch("loginUser", {
                        username: username.value,
                        password: password.value,
                    });
                    modalOpen.value = false;
                }
            })
            .catch((err) => console.log(err));
    } else {
        if (!validUsername) {
            usernameMsg.value = "Username must be in format user@example.com.";
        } else {
            usernameMsg.value = "";
        }
        if (!validPassword) {
            passwordMsg.value =
                "Must contain 1 number and 1 uppercase. Length > 8.";
        } else {
            passwordMsg.value = "";
        }
        if (!passwordsMatch || passwordRepeat.value == "") {
            repeatMsg.value = "Passwords must match.";
        } else {
            repeatMsg.value = "";
        }
    }
}