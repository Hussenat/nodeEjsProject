// basic structure of backend server
// require('dotenv').config(); // its enable access to environment variables inside .env file
// const express = require('express');
// const mongoose = require('mongoose');
// const session = require('express-session');

// const app = express();
// const PORT = process.env.PORT || 4000;

// app.get('/', (req, res) => {
//     res.send('Hello World')
// });

// app.listen(PORT, () => {
//     console.log(`Server started at http://localhost:${PORT}`)
// });

// ======================================
// DATABASE CONNECTION

// require('dotenv').config(); // its enable access to environment variables inside .env file
// const express = require('express');
// const mongoose = require('mongoose');
// const session = require('express-session');

// const app = express();
// const PORT = process.env.PORT || 4000;

// // database connection
// mongoose.connect(process.env.DB_URI, {
//     useNewUrlParser: true, // allows user to fall back to the old parser if they find bug in new parser
//     useUnifiedTopology: true, // removes support for several connection options that are no longer relevant
// });
// const db = mongoose.connection;
// db.on('error', (error) => console.log(error));
// db.once('open', () => console.log('connected to database!'));


// app.get('/', (req, res) => {
//     res.send('Hello World')
// });

// app.listen(PORT, () => {
//     console.log(`Server started at http://localhost:${PORT}`)
// });

// ======================================
// add middlewares
require('dotenv').config(); // its enable access to environment variables inside .env file
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const router = require('./routes/routes');
// const path = require('path');

const app = express();
const PORT = process.env.PORT || 4000;

// database connection
mongoose.connect(process.env.ATLAS_URI, { // for you to connected to mogodb you need this object properties because without them it wouldn't work it might work locally buh it wouldn't work with the atlas
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', (error) => console.log(error)); // on means when it is disconnected it should throw an error
db.once('open', () => console.log('connected to database!')); // once means the connection is successful

// middlewares -> middlewares are functions that has three arguments which are req, res and next and they are all object.
app.use(express.urlencoded({ extended: false })); // it enables user to send and receive data from frontend to backend
app.use(express.json()) // helps to send our information in json format
app.use(session({
        secret: 'mysecret ejs',
        saveUninitialized: true,
        resave: false,
    })
);
// for saving session message onto the req object
app.use((req, res, next) => {
    res.locals.message = req.session.message;
    delete req.session.message;
    next();
});

// add this to view the images on the ejs page
app.use(express.static('public'));
// app.use(express.static(path.join(__dirname, './public')));

// set the template engine which is EJS
app.set('view engine', 'ejs');

// app.get('/', (req, res) => {
//     res.send('Hello World')
// });

// route prefix
app.use('', router);

app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`)
});