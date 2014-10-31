var fs = require('fs');
var express = require('express');
var app = express();
var logger = require('./logger');
var config = require('./config');
var env = config.get('env');
var assets = config.get('assets');
var Page = require('./page');

app
    .use(function (req, res, next)
    {
        req.host = req.headers.host;
        req.path = req._parsedUrl.pathname;
        next();
    })
    .use(assets.middleware())
    .use('/blocks', express.static(__dirname + '/../blocks'))
    .use('/public', express.static(__dirname + '/../public'))
    .use(app.router)
    .use(function (req, res)
    {
        res.statusCode = 404;
        res.end('Not found');
    })
    .use(function (err, req, res, next)
    {
        /* jshint unused: vars */
        res.statusCode = 500;
        logger.error(err.stack);
        res.end('Internal error');
    });

/**
 * Routing
 */
app
    .get('/', Page.createHandler('index'))
    .get('/:page', function (req, res, next)
    {
        var pageName = req.params.page;
        Page.createHandler(pageName)(req, res, next);
    });

var data = (function ()
{
    var array = [];
    for (var i = 0; i < 10099; i++) {
        array[i] = Math.random() * 100;
    }
    return array
})();

var time = "";

app.post('/tm_proxy', function (req, res)
{
    data[data.length] = Math.random() * 100;
    data = data.slice(1);
    time = (new Date()).setSeconds(0);

    res.send({time: time, value: data});
});

function startApp(portOrSocket)
{
    app
        .listen(portOrSocket, function ()
        {
            logger.info('app started on %s', portOrSocket);
            if (env.socket) {
                fs.chmod(env.socket, '0777');
            }
        })
        .once('error', function (err)
        {
            logger.error('worker %s has failed to start application', process.pid);
            if (err.code === 'EADDRINUSE') {
                logger.error('port (or socket) %s is taken', portOrSocket);
                process.kill();
            } else {
                console.log(err.stack);
            }
        });
}

exports.start = function ()
{
    startApp(env.socket || env.port || 8080);
};

if (!module.parent) {
    exports.start();
}
