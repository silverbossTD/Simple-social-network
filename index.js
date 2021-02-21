const express        = require('express');
const connect        = require('./server');

const expressLayouts = require('express-ejs-layouts');

const bodyParser     = require('body-parser');
const cookieParser   = require('cookie-parser');
const fileUpload     = require('express-fileupload');

const app            = express();
const port           = process.env.PORT || 4000;

const homeRoute      = require('./routes/home.route');
const authRoute      = require('./routes/auth.route');
const profileRoute   = require('./routes/profile.route');
const postRoute      = require('./routes/post.route');

const authMiddleware = require('./middlewares/auth.middleware');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(cookieParser());

app.use(expressLayouts);
app.set('layout', './layouts/full-width');
app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use('/css', express.static(__dirname + 'public/css'));
app.use('/js', express.static(__dirname + 'public/js'));

app.use(fileUpload());

connect();

app.use('/auth', authRoute);
app.use('/', homeRoute);
app.use('/profile', profileRoute);
app.use('/post', postRoute);

app.listen(port, () => console.log(`Server running at http://localhost:${port}`));
