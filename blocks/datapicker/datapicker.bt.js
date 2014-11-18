module.exports = function (bt) {

    bt.match('datapicker', function (ctx) {
        ctx.setTag('div');

        ctx.setContent([
            {elem: "month"}
        ]);
    });

    bt.match('datapicker__month', function (ctx){
        ctx.setTag('div');

    });

    bt.match('datapicker__month-title', function (ctx){
        ctx.setTag('div');

    });

    bt.match('datapicker__day', function (ctx){
        ctx.setTag('div');

    })
};
