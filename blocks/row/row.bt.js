module.exports = function (bt) {

    bt.match('row', function (ctx) {
        ctx.setTag('div');
        var content = ctx.getParam("content");
        ctx.setContent(content);
    });

};
