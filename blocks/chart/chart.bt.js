module.exports = function (bt)
{

    bt.match('chart', function (ctx)
    {
        ctx.enableAutoInit();
        ctx.setTag('div');

        ctx.setContent([
            {
                elem: "title",
                name: ctx.getParam("name")
            },
            {
                elem: "value"
            },
            {
                elem: "view"
            },
            {
                elem: "days"
            }
        ]);
    });

    bt.match("chart__*", function (ctx)
    {
        ctx.setTag('div');

    });

    bt.match("chart__title", function (ctx)
    {
        ctx.setContent(ctx.getParam("name"))
    });

};
