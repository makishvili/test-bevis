module.exports = function (bt)
{

    bt.match('select', function (ctx)
    {
        ctx.setTag('div');

        ctx.setContent([
            {
                elem: "list",
                list: ctx.getParam('list')
            }
        ]);
    });

    bt.match('select__list', function (ctx)
    {
        ctx.setContent((function ()
            {
                var list = ctx.getParam('list'),
                    array = [];

                list.map(function (a)
                {
                    array.push({
                        elem: "item",
                        value: a
                    })
                });

                return array;
            })()
        )
    });
    bt.match('select__item', function (ctx)
    {
        ctx.setContent(ctx.getParam('value'))
    })

};
