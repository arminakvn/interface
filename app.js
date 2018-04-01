// var path;
'use strict';

const express = require('express');
// var graphqlHTTP = require('express-graphql');
// var app, async, http, path, request, serveStatic, Sequelize, sequelize, formidable, fs;
// var { buildSchema } = require('graphql');

// Construct a schema, using GraphQL schema language
// var schema = buildSchema(`
//     type Query {
//         hello: String
//     }
// `);
// // The root provides a resolver function for each API endpoint
// var root = {
//     hello: () => {
//         return 'Hello world!';
//     },
// };
var request = require('request');
var cons = require('consolidate');
var path = require('path');
var exphbs = require('express-handlebars')
var http = require('http');
var async = require('async');
var serveStatic = require('serve-static');
var Sequelize = require('sequelize');
var formidable = require('formidable');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session')
var flash = require('connect-flash');
const Auth0Strategy = require('passport-auth0');
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn();
var fs = require('fs');

// const user = require('./routes/user');
var iframeReplacement = require('node-iframe-replacement');


const env = {
    AUTH0_CLIENT_ID: 'gKc2ToRIgTlYeuF65Nvw7OfBa07yzGj1',
    AUTH0_DOMAIN: 'armin.auth0.com',
    AUTH0_CALLBACK_URL: 'http://localhost/callback'
};



// Configure Passport to use Auth0
const strategy = new Auth0Strategy({
        domain: 'armin.auth0.com',
        clientID: 'gKc2ToRIgTlYeuF65Nvw7OfBa07yzGj1',
        clientSecret: 'p1l6T6nNAxtxC9-szqCRtD2alSn2MNFpIR66aNRvvCSMWbQNgIAvGEDIQovvaE-k',
        callbackURL: 'http://localhost/callback',
        state: 'ENABLED'
    },
    (accessToken, refreshToken, extraParams, profile, done) => {
        console.log("in strategy fefinitions", profile);
        return done(null, profile);
    }
);

passport.use(strategy);

// This can be used to keep a smaller payload
passport.serializeUser(function(user, done) {
    console.log("serializeUser", user);
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    console.log("deserializeUser", user);
    done(null, user);
});


var sequelize = new Sequelize('postgres', 'postgres', 'postgres', {
    host: 'postgresql', //'128.31.25.188',
    dialect: 'postgres'
});


const app = express();


app.disable('etag');

app.set('trust proxy', true);
app.use(serveStatic('./bower_components/jquery/dist'));
app.use(serveStatic('./bower_components/d3'));
app.use(serveStatic('./bower_components/paper/dist'));
app.use(serveStatic('./bower_components/semantic/dist'));
app.use(serveStatic('./static'));
app.use(serveStatic('./images'));
app.use(serveStatic('./scripts'));
app.use(serveStatic('./styles'));

app.use(serveStatic('./data'));
app.use(serveStatic('./templates'));
app.set('view engine', 'html');
// app.use(serveStatic('./', {
//     'index': ['index.html', 'index.htm']
// }));
// app.use(serveStatic('./', {
//     'index': ['index.html', 'index.htm']
// }));

// app.engine("html", engines.html);
// app.engine('pug', cons.pug);

app.set('views', path.join(__dirname, 'views'));

app.set('view engine', 'pug');
let expressLogging = require('express-logging'),
    logger = require('logops');
app.use(expressLogging(logger));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(iframeReplacement);

let sess = {
    secret: 'abbascat',
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
};

app.use(session(sess))



// ...
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

// Handle auth failure error messages
app.use(function(req, res, next) {
    if (req && req.query && req.query.error) {
        req.flash("error", req.query.error);
    }
    if (req && req.query && req.query.error_description) {
        req.flash("error_description", req.query.error_description);
    }
    next();
});

// Check logged in
app.use(function(req, res, next) {
    res.locals.loggedIn = false;
    if (req.session.passport && typeof req.session.passport.user != 'undefined') {
        console.log("req.session.passport.user", req.session.passport.user)
        res.locals.loggedIn = true;
    }
    next();
});

// app.use('/user', user);

app.get('/user', ensureLoggedIn, function(req, res, next) {
    // console.log("req.session.passport.user, req.user)", req.session.passport.user, req.user)
    res.render('user', {
        user: req.user,
        userProfile: JSON.stringify(req.user, null, '  ')
    });
});


// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//     const err = new Error('Not Found');
//     err.status = 404;
//     next(err);
// });

// // error handlers
// app.set('env', 'development');
// // development error handler
// // will print stacktrace
// if (app.get('env') === 'development') {
//     app.use(function(err, req, res, next) {
//         res.status(err.status || 500);
//         res.render('error', {
//             message: err.message,
//             error: err
//         });
//     });
// }

// // production error handler
// // no stacktraces leaked to user
// app.use(function(err, req, res, next) {
//     res.status(err.status || 500);
//     res.render('error', {
//         message: err.message,
//         error: {}
//     });
// });

app.get('/us_json', function(req, res) {
    sequelize.query('SELECT * FROM us_json', {
        type: sequelize.QueryTypes.SELECT
    }).then(function(object) {
        res.json(object);
    });
});

app.get('/addresses/:address', function(req, res) {
    sequelize.query('SELECT * FROM addresses', {
        type: sequelize.QueryTypes.SELECT
    }).then(function(object) {
        res.json(object);
    });
});


// app.get('/pandas', function(req, res) {

//     res.merge('fake-news', {
//         // external url to fetch
//         sourceUrl: 'http://localhost:8888',
//         // css selector to inject our content into
//         //    sourcePlaceholder: 'div[data-entityid="container-top-stories#1"]',
//         // pass a function here to intercept the source html prior to merging
//         transform: null
//     });

//     // url = "http://localhost/panda/"
//     // return res.redirect('http://localhost/panda/');
//     // request("http://localhost/panda/", function(err, resp, body) {
//     //     console.log("body responds", body, resp)

//     //     if (!body) {
//     //         var craig = "No results found. Try again.";
//     //     } else {
//     //         body = JSON.parse(body);
//     //         console.log(body)
//     //         var craig = body
//     //     }
//     // })
// })

app.get('/processaddress/:configs', function(req, res) {
    // console.log("configs", configs.split(",")[0])
    url = "http://localhost/parcelprocess/" + req.params.configs
    request(url, function(err, resp, body) {

        // console.log(body, resp, err)


        // logic used to compare search results with the input from user
        if (!body) {
            craig = "No results found. Try again.";
        } else {
            body = JSON.parse(body);
            console.log(body)
            craig = body
        }
    });




    res.send(craig);

    // sequelize.query('SELECT * FROM all_parcels WHERE muni_id = :muni limit 400', {
    //   replacements: {
    //     muni: "" + req.params.muni
    //   },
    //   type: sequelize.QueryTypes.SELECT
    // }).then(function(object) {
    //   res.json(object);
    // });

});

app.get('/get_by_par_id/:par_id', function(req, res) {

    if (req.params.par_id == 0) {

        res.json({ 'status': 'zero results' });


    } else {
        sequelize.query('SELECT * FROM parcels_tiger WHERE ma_lp_id= :lp_id', {
            replacements: {
                lp_id: "" + req.params.par_id
            },
            type: sequelize.QueryTypes.SELECT
        }).then(function(object) {
            res.json(object);
        });
        return


    }

    return;
});


app.get('/get_address/:paginate', function(req, res) {
    sequelize.query('SELECT * FROM all_parcels_16 limit 10 offset :paginate', {
        replacements: {
            muni: "" + 35,
            paginate: req.params.paginate * 10
        },
        type: sequelize.QueryTypes.SELECT
    }).then(function(object) {
        res.json(object);
    });
    return;
});


app.post('/upload', function(req, res) {
    // console.log("do we know who the user is at this point? ", req.user);
    req.session.name = "session name";
    // console.log("session ", req.session);
    // create an incoming form object
    var form = new formidable.IncomingForm();
    form.parse(req);
    // var filepath = "";
    // specify that we want to allow the user to upload multiple files in a single request
    form.multiples = true;

    // store all uploads in the /uploads directory
    form.uploadDir = path.join(__dirname, '/uploads');

    // every time a file has been uploaded successfully,
    // form.on('fileBegin', function(name, file) {
    //     file.path = __dirname + '/uploads/' + file.name;
    // });
    // rename it to it's orignal name
    form.on('file', function(file) {
        // console.log("file", file)
        // filepath = file.path;
        fs.rename(file.path, path.join(form.uploadDir, file.name));
    });

    // log any errors that occur
    form.on('error', function(err) {
        console.log('An error has occured: \n' + err);
    });

    // once all the files have been uploaded, send a response to the client
    form.on('end', function(file) {
        // console.log(filepath);
        res.end('success');
    });

    // parse the incoming request containing the form data
    // form.parse(req);


});
app.get('/dashboard', function(req, res) {
    // if (!req.user || req.user.status !== 'ENABLED') {
    //     return res.redirect('/login');
    // }

    res.render('dashboard', {
        title: 'Dashboard',
        user: req.user,
    });
});

app.get(
    '/login',
    passport.authenticate('auth0', {
        responseType: 'code',
        scope: 'openid profile email',
    }),
    function(req, res) {
        res.redirect('/');
    }
);

app.get(
    '/callback',
    passport.authenticate('auth0', {
        failureRedirect: '/failure'
    }),
    function(req, res) {
        // console.log("req's session ", req.session)
        // req.session.returnTo = '/home'
        // console.log(req.session.returnTo);
        // res.user = req.session["passport"]["user"];
        // req.session.user.status = 'ENABLED';
        // console.log("req.session passport user", req.session["passport"], req.session["passport"]["user"])
        res.user = "Admin";
        // console.log("res", res.user)
        res.redirect(req.session.returnTo || "/home");

    }
);

app.get('/logout', (req, res) => {
    req.logout();
    req.session.destroy();
    res.redirect('/');
});

app.get('/home', function(req, res) {

    // if (!req.user) {
    //     return res.redirect('/login');
    // }
    // console.log("home req", req.user.status)
    res.render('home', {
        title: 'home'
    });


});




app.get('/', function(req, res) {

    // if (!req.user || req.user.status !== 'ENABLED') {
    //     return res.redirect('/login');
    // }
    res.render('home', {
        title: 'home'
    });
    // res.render('index.html')
    // res.render('index', function(err, html) {
    //     res.send(html);
    // });
});




// module.exports = {
//     app: app,
//     port: 8080
// };

app.listen(8080);