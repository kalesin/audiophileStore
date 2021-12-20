const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const { Client } = require('pg');
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
})

client.connect();


const getUser = (username) => {
  return new Promise(resolve => {
    client.query('SELECT * FROM users WHERE username=$1', [username], (err, res) => {
      if (err) throw err;
      res.rows.length ? resolve(res.rows[0]) : resolve(false);
    })
  })
}

const registerUser = (username, password) => {
  return new Promise((resolve, reject) => {
    console.log('user, pass', username, password)
    const saltRounds = 10;
    let promise = new Promise((resolve, reject) => {
      bcrypt.hash(password, saltRounds, function (err, hash) {
        if (err) {
          reject(err)
        } else {
          resolve(hash)
        }
      })
    });
    promise.then(
      hash => {
        console.log('user, hash', username, hash)
        client.query(`INSERT INTO users(username, hash)
        VALUES ($1, $2);`, [username, hash], (err, res) => {
          console.log('insert')
          if (err) {
            reject(err)
          } else {
            console.log(res.rows);
            resolve(true)
          }
        })
      }
    ).catch(function (error) {
      console.log(error);
    })
  })
}

const comparePasswords = (password, hash) => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, hash, function (err, result) {
      console.log('result', result)
      resolve(result);
    });
  })
}

const updatePassword = (username, password) => {
  return new Promise((resolve, reject) => {
    const saltRounds = 10;
    let promise = new Promise((resolve, reject) => {
      bcrypt.hash(password, saltRounds, function (err, hash) {
        if (err) {
          reject(err)
        } else {
          resolve(hash)
        }
      })
    });
    promise.then(
      hash => {
        console.log('user, hash', username, hash)
        client.query(`UPDATE users
        SET hash=$2
        WHERE username=$1;
        `, [username, hash], (err, res) => {
          console.log('update')
          if (err) {
            reject(err)
          } else {
            console.log(res.rows);
            resolve(true)
          }
        })
      }
    ).catch(function (error) {
      console.log(error);
    })
  })
}

const addToken = (id, username, tokenType) => {
  return new Promise((resolve, reject) => {
    const token = jwt.sign(
      { id, username },
      'secretKey',
      {
        expiresIn: "2h",
      }
    );
    client.query(`INSERT INTO tokens(id, username, token, isResetToken)
        VALUES ($1, $2, $3, $4) RETURNING *;`, [id, username, token, tokenType], (err, res) => {
      if (err) {
        reject(err)
      } else {
        resolve(res.rows[0]);
      }
    })
  })
}

const checkToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, 'secretKey', (err, decoded) => {
      if (err) {
        //delete token from DB
        client.query(`DELETE FROM tokens WHERE token=$1 RETURNING *`, [token], (err, res) => {
          if (err) {
            reject(err)
          } else {
            console.log(res.rows[0]);
          }
        })
        reject(err)
      } else {
        resolve(true)
      }
    });
  })
}

const findToken = (token, tokenType) => {
  return new Promise((resolve, reject) => {
    client.query(`SELECT * FROM tokens WHERE token=$1 AND isResetToken=$2`, [token, tokenType], (err, res) => {
      if (err) {
        reject(err)
      } else {
        res.rows.length ? resolve(res.rows[0]) : resolve(false);
      }
    })
  })
}

const findTokenByUser = (username, tokenType) => {
  return new Promise((resolve, reject) => {
    client.query(`SELECT * FROM tokens WHERE username=$1 AND isResetToken=$2`, [username, tokenType], (err, res) => {
      if (err) {
        reject(err)
      } else {
        res.rows.length ? resolve(res.rows[0]) : resolve(false);
      }
    })
  })
}

const removeToken = (token, tokenType) => {
  return new Promise((resolve, reject) => {
    client.query(`DELETE FROM tokens WHERE token=$1 AND isResetToken=$2;`, [token, tokenType], (err, res) => {
      if (err) {
        reject(err)
      } else {
        resolve(true);
      }
    })
  })
}

const addOrder = (username, payment_received, email_sent, order_total) => {
  return new Promise((resolve, reject) => {
    client.query(`INSERT INTO orders(username, payment_received, email_sent, order_total)
        VALUES ($1, $2, $3, $4) RETURNING *;`, [username, payment_received, email_sent, order_total], (err, res) => {
      if (err) {
        reject(err)
      } else {
        console.log(res.rows[0])
        resolve(res.rows[0]);
      }
    })
  })
}

const findOrder = (id) => {
  console.log(id)
  return new Promise((resolve, reject) => {
    client.query(`SELECT * FROM orders WHERE id=$1;`, [id], (err, res) => {
      if (err) {
        reject(err)
      } else {
        resolve(res.rows[0]);
      }
    })
  })
}

const updateOrder = (id, column) => {
  return new Promise((resolve, reject) => {
    client.query(`UPDATE orders
    SET ${column}=$2
    WHERE id=$1;`, [id, column], (err, res) => {
      if (err) {
        reject(err)
      } else {
        resolve(res.rows[0]);
      }
    })
  })
}

const addItem = (order_id, item_name, item_amount) => {
  return new Promise((resolve, reject) => {
    client.query(`INSERT INTO items(order_id, item_name, item_amount) VALUES ($1, $2, $3) RETURNING *`, [order_id, item_name, item_amount], (err, res) => {
      if (err) {
        reject(err)
      } else {
        resolve(res.rows[0]);
      }
    })
  })
}

const findItem = (order_id) => {
  return new Promise((resolve, reject) => {
    client.query(`SELECT * FROM items WHERE order_id=$1`, [order_id], (err, res) => {
      if (err) {
        reject(err)
      } else {
        resolve(res.rows);
      }
    })
  })
}

const addAddress = (order_id, is_shipping_address, phone, name, address, zip, city, country) => {
  return new Promise((resolve, reject) => {
    client.query(`INSERT INTO addresses(order_id, is_shipping_address, phone, name, address, zip, city, country)
        VALUES ($1, $2, $3, $4,$5,$6,$7,$8) RETURNING *;`, [order_id, is_shipping_address, phone, name, address, zip, city, country], (err, res) => {
      if (err) {
        reject(err)
      } else {
        resolve(res.rows[0]);
      }
    })
  })
}

const findAddress = (order_id) => {
  return new Promise((resolve, reject) => {
    client.query(`SELECT * FROM addresses WHERE order_id=$1`, [order_id], (err, res) => {
      if (err) {
        reject(err)
      } else {
        res.rows.length ? resolve(res.rows) : resolve(false);
      }
    })
  })
}

module.exports = {
  addToken,
  findToken,
  findTokenByUser,
  checkToken,
  removeToken,
  getUser,
  registerUser,
  updatePassword,
  comparePasswords,
  addAddress,
  findAddress,
  addItem,
  findItem,
  addOrder,
  findOrder,
  updateOrder
}
