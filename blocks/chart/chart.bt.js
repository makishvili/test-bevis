module.exports = function (bt) {

    bt.match('chart', function (ctx) {
        ctx.enableAutoInit();
        ctx.setTag('div');

        //ctx.setContent('График не проинициализировался');
    });

};
