module.exports = function (bt)
{

    bt.match('snake', function (ctx)
    {
        ctx.setTag('div');

        ctx.setContent(
            (function ()
            {
                var arr = [];
                for (var i = 0; i < 4; i++) {
                    arr.push({elem: 'box' + i})
                }
                return arr
            })());
    });

};
