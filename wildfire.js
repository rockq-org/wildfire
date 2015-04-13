/*!
 * nodeclub - app.js
 */

/**
 * Module dependencies.
 */

var config = require('./config');
var appInit = require('./appinit.js');

if (!config.debug) {
    require('newrelic');
}
var util = require('util');
var path = require('path');
var Loader = require('loader');
var express = require('express');
var session = require('express-session');
var passport = require('passport');
require('./persistence/database');
require('./models');
var GitHubStrategy = require('passport-github').Strategy;
var githubStrategyMiddleware = require('./middlewares/github_strategy');
var WechatStrategy = require('passport-wechat');
var webRouter = require('./web_router');
var apiRouterV1 = require('./api_router_v1');
var auth = require('./middlewares/auth');
var proxyMiddleware = require('./middlewares/proxy');
var MongoStore = require('connect-mongo')(session);
var _ = require('lodash');
var csurf = require('csurf');
var compress = require('compression');
var bodyParser = require('body-parser');
var busboy = require('connect-busboy');
var errorhandler = require('errorhandler');
var cors = require('cors');
var limitMiddleware = require('./middlewares/limit');
var logger = require('./common/loggerUtil').getLogger('app');
var wechat = require('./middlewares/connect-wechat');
var wxConfig = require('./wechat-gzh.json');
var UserProxy = require('./proxy/user');

// 静态文件目录
var staticDir = path.join(__dirname, 'public');

// assets
var assets = {};
if (config.mini_assets) {
    try {
        assets = require('./assets.json');
    } catch (e) {
        console.log('You must execute `make build` before start app when mini_assets is true.');
        throw e;
    }
}

var urlinfo = require('url').parse(config.host);
config.hostname = urlinfo.hostname || config.host;

var app = express();

// configuration in all env
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', require('ejs-mate'));
/**
 * Need to support wechat entry, disable the default layout.
 * Specific layout in each partial views.
 * <%- layout( 'layout.html') %>
 * http://yijiebuyi.com/blog/08cf14e904325c19814465689453b3aa.html
 */
// app.locals._layoutFile = 'layout.html';
app.enable('trust proxy');


// 静态资源
app.use(Loader.less(__dirname));
app.use('/public', express.static(staticDir));
app.use('/agent', proxyMiddleware.proxy);

// 每日访问限制
// app.use(limitMiddleware.peripperday('all', config.visit_per_day));

app.use(require('response-time')());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(require('method-override')());
app.use(require('cookie-parser')(config.session_secret));
app.use(compress());
app.use(session({
    secret: config.session_secret,
    store: new MongoStore({
        url: config.db
    }),
    resave: true,
    saveUninitialized: true,
}));

app.use(passport.initialize());

// custom middleware
app.use(auth.authUser);
app.use(auth.blockUser());


if (!config.debug) {
    app.use(function(req, res, next) {
        if (req.path.indexOf('/api') === -1) {
            csurf()(req, res, next);
            return;
        }
        next();
    });
    app.set('view cache', true);
}

// for debug
// app.get('/err', function (req, res, next) {
//   next(new Error('haha'))
// });

// set static, dynamic helpers
_.extend(app.locals, {
    config: config,
    Loader: Loader,
    assets: assets
});

_.extend(app.locals, require('./common/render_helper'));
app.use(function(req, res, next) {
    res.locals.csrf = req.csrfToken ? req.csrfToken() : '';
    next();
});

// github oauth
passport.serializeUser(function(user, done) {
    done(null, user);
});
passport.deserializeUser(function(user, done) {
    done(null, user);
});

passport.use(new GitHubStrategy(config.GITHUB_OAUTH, githubStrategyMiddleware));

/**
 * Wechat UAA Service for ionic app embedded wechat 
 * @param  {[type]} req           [description]
 * @param  {[type]} openid        [description]
 * @param  {[type]} profile       [description]
 * @param  {[type]} params        [description]
 * @param  {[type]} done)         {               req.session.wechat_params [description]
 * @param  {[type]} function(err) {                                                         console.log("Error logging in user");        console.log(err [description]
 * @return {[type]}               [description]
 */
passport.use(new WechatStrategy({
    appid: wxConfig.appId,
    appsecret: wxConfig.appSecret,
    callbackURL: util.format('http://%s/auth/wechat/embedded/callback', config.host),
    scope: 'snsapi_userinfo',
    passReqToCallback: true,
    state: true
        // }, function (openid, profile, token, done) {
}, function(req, openid, profile, params, done) {
    req.session.wechat_params = params;
    var _profile = {
        "provider": "wechat",
        "id": profile.unionid,
        "displayName": profile.nickname,
        "user": true,
        "__v": 0,
        "profile": profile
    };
    /**
     * {
  "provider": "wechat",
  "id": "o0DaijgmdOUuAIRQ1QNZzuTizOT8",
  "displayName": "王海良",
  "user": true,
  "__v": 0,
  "profile": {
    "openid": "ogWfMt5hcNzyPu2BRHjGj4CZmGqo",
    "nickname": "王海良",
    "sex": 1,
    "language": "en",
    "city": "Haidian",
    "province": "Beijing",
    "country": "China",
    "headimgurl": "http://wx.qlogo.cn/mmopen/Q3auHgzwzM4K3X0qF1xm0lH7MWFobvcge14aBibJbeV78z9TwWjicb5gOwVbQ7QO0CiaIBGv1DrJibDL0tacJM6VZw/0",
    "privilege": [],
    "unionid": "o0DaijgmdOUuAIRQ1QNZzuTizOT8"
  }
}
     */
    logger.debug('snsapi_userinfo', JSON.stringify(_profile));

    // profileModule.findOrCreate(_profile, {}).then(function(dbProfile) {
    //     req.logIn(dbProfile, function(err) {
    //         return done(null, dbProfile);
    //     });
    // }, function(err) {
    //     console.log("Error logging in user");
    //     console.log(err);
    //     done(err);
    // }).end();

    // create user profile
    UserProxy.newOrUpdate(_profile)
        .then(function(user) {
            req.logIn(user, function(err) {
                return done(null, user);
            });
        })
        .fail(function(err) {
            return done(err);
        });


    // return done(null, openid, profile);
}));

app.get('/auth/wechat/embedded', passport.authenticate('wechat'), function(req, res) {
    //dont't call it
});


// app.get('/auth/wechat/embedded/callback', passport.authenticate('wechat', {
//     failureRedirect: '/auth/wechat/embedded/err',
//     successRedirect: '/auth/wechat/embedded/success'
// }));

app.get('/auth/wechat/embedded/callback', function(req, res, next) {
    passport.authenticate('wechat', function(err, user, info) {
        if (err) {
            logger.error('wechat uaa', err);
        } else {
            logger.debug('wechat uaa', );
        }
        res.redirect(util.format('http://%s/public/ionic/www/wechat', config.host));
    })(req, res, next);
});

//endof auth/wechat/embedded

app.use(busboy({
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB
    }
}));

// routes
app.use('/api/v1', cors(), apiRouterV1);
app.use('/', webRouter);
wechat.setup(app, '/connect-wechat');

// error handler
if (config.debug) {
    app.use(errorhandler());
} else {
    app.use(function(err, req, res, next) {
        console.error('server 500 error:', err);
        return res.status(500).send('500 status');
    });
}

app.listen(config.port, function() {
    logger.info("wildfire listening on port %d", config.port);
    logger.info("God bless love....");
    logger.info("You can debug your app with http://" + config.hostname + ':' + config.port);
});


module.exports = app;
