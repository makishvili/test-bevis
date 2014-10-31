module.exports = function (bt)
{

    bt.match('content', function (ctx)
    {
        ctx.setTag('div');
        ctx.setContent(ctx.getParam('content'));
    });

};
