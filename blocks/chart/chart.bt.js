module.exports = function (bt)
{

    bt.match('chart', function (ctx)
    {
        ctx.enableAutoInit();
        ctx.setTag('div');

        ctx.setContent([
            {
                elem: "view"
            },
            {
                elem: "days"
            }
        ]);
    });

    bt.match("chart__view", function (ctx)
    {
        ctx.setTag('div');

    });
    bt.match("chart__days", function (ctx)
    {
        ctx.setTag('div');
    })

};
