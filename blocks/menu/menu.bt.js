module.exports = function (bt)
{

    bt.match('menu', function (ctx)
    {
        ctx.setTag('div');

        ctx.setContent(
            ['СТМ DartIT',
             {
                 block: "settings"
             }
            ]
        );
    });

};
