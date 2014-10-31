module.exports = function (bt)
{

    bt.match('button*', function (ctx)
    {
        ctx.setContent([
            {
                elem: "control",
                value: ctx.getParam('value'),
                type: ctx.getParam('type')
            }
        ]);
    });

    bt.match('button*__control', function (ctx)
    {
        ctx.setTag('button');
        ctx.setAttr('type', ctx.getParam('type') || 'button');
        ctx.setContent(ctx.getParam('value') || "Кнопка");
    })

};
