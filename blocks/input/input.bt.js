module.exports = function (bt) {

    bt.match('input', function (ctx) {
        ctx.setTag('div');
        ctx.setContent([
            {
                elem: "control",
                value: ctx.getParam('value'),
                placeholder: ctx.getParam('placeholder')
            }
        ]);
    });

    bt.match('input__control', function(ctx){
        ctx.setTag('input');
        ctx.setAttr('value',ctx.getParam('value'));
        ctx.setAttr('placeholder',ctx.getParam('placeholder'));
    })

};
