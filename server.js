const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const { v4: uuid } = require('uuid');
const { logger } = require('./middleware/logEvents')
const errorHandler = require('./middleware/errorHandler');
const verifyJWT = require('./middleware/verifyJWT');
const cookieParser = require('cookie-parser')

const EventsEmitter = require('events');
const path = require('path');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const credentials = require('./middleware/credentials');

global.sidebarStatus = false;
global.currentGroupID = null;

const PORT = process.env.PORT || 8080;
// Set EJS template 
app.set('views', 'views');
app.set('view engine', 'ejs')

// custom middleware logger
app.use(logger);

//Handle options credentials check - before CORS!
// and fetch cookies credentials requirment
app.use(credentials);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// build-in middleware to handle urlencoded from data
app.use(express.urlencoded({ extended: false }));

// build-in middleware for json
app.use(express.json());

// middleware for cookies
app.use(cookieParser());

// serve static files
app.use('/', express.static(path.join(__dirname, 'public')));

// routes
app.use('/', require('./routes/root'));
app.use('/register', require('./routes/register'));
app.use('/auth', require('./routes/auth'));
app.use('/refresh', require('./routes/refresh'));
                                           
// verified roots below                    
app.use(verifyJWT);
app.use('/logout', require('./routes/logout'));
app.use('/dashboard', require('./routes/api/dashboard'));
app.use('/invoice', require('./routes/api/invoice'));
app.use('/members', require('./routes/api/members'));
app.use('/email', require('./routes/api/email'));
app.use('/profile', require('./routes/api/profile'));
app.use('/budget', require('./routes/api/budget'));
app.use('/cookies', require('./routes/api/cookie'));
/*app.use('/employees', require('./routes/api/employees'));*/

//Default route
app.all('*', (req, res) => {
    res.status(404)
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'))
    } else if (req.accepts('json')) {
        res.json({ error: '404 Not Found' })
    } else {
        res.type('txt').send('404 Not Found')
    }
});

app.use(errorHandler)

const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});



/*myEmitter.on('log', (msg) => logEvents(msg))

// Emit event
myEmitter.emit('log', 'Log event emitted!')*/






/*const app = express();

// Request a new token
// DISCLAIMER: User should be authenticated!!
app.get('/token', (req, res) => {
    const payload = {
        name: "Jimmy",
        scopes: ['customer:create', 'customer:read']
    };

    const token = jwt.sign(payload, config.JWT_SECRET);
    res.send(token);
});

app.get('/customer', authorize('customer:read'), (req, res) => {
    res.send('Hello World!');
});
*/






//app.use('/subdir', express.static(path.join(__dirname, '/public')));
//app.use('/subdir', require('./routes/subdir'));
