module.exports = function (bt)
{

    bt.match('spiner', function (ctx)
    {
        ctx.setTag('div');
        ctx.setContent([{elem: "line"}]);
    });

};
