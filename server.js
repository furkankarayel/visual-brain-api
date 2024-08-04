const express = require('express');
const rateLimit = require('express-rate-limit')
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors');
const knex = require('knex')

require('dotenv').config();
const saltRounds = 10;

const login = require('./controllers/login')
const register = require('./controllers/register')
const profile = require('./controllers/profile')
const image = require('./controllers/image')

const db = knex({
    client: 'pg',
    connection: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    },
  });

const app = express();

app.use(bodyParser.json())
app.use(cors())

app.post('/login', login.handleLogin(db,bcrypt))
app.post('/register', register.handleRegister(db,bcrypt,saltRounds))
app.get('/profile/:id', profile.handleProfileGet(db))
app.put('/image', image.handleImage(db))
app.post('/image/facedetection', image.handleFaceApiCall)
app.post('/image/description', image.handleDescriptionApiCall)


app.listen(3000, ()=> {
    console.log('app is running on port 3000');
})

