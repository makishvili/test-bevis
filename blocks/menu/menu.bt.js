module.exports = function (bt)
{

    bt.match('menu', function (ctx)
    {
        ctx.setTag('div');

        ctx.setContent(
            ['Заголовок',
             {
                 block: "settings"
             }
            ]
        );
    });

};
