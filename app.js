const express = require('express');
const app = express();
const exphbs = require('express-handlebars');
const methodOverride = require('method-override')
const mongoose = require('mongoose');
const passport = require('passport');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
//const reload = require('reload');
const path = require('path');


const port = 5000


//Connect to mongoose
mongoose.connect('mongodb://localhost/vidjot-dev', {useNewUrlParser: true})
    .then(() => console.log('MongoDb Connected'))
    .catch(err => console.log(err))

//Load Routes
const ideas = require('./routes/ideas')
const users = require('./routes/users')

//Passport Config
require('./config/passport')(passport);

//Handlebars Middleware
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//Body parser middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Method override middleware
app.use(methodOverride('_method'));

//Static folder
app.use(express.static(path.join(__dirname, 'public')));

//Express Session Middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
}))

app.use(flash());

// Global variables
app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
})

//Index Route
app.get('/', (req, res) => {
    const title = 'Welcome'
    res.render('index', {title: title})
})

//About Route
app.get('/about', (req, res) => {
    res.render('About')
})

app.use('/ideas', ideas)
app.use('/users', users)

app.listen(port, () => {
    console.log(`app started in port ${port}`)
})