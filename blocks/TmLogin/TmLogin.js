modules.define(
    'TmLogin',
    ['inherit', 'block'],
    function (provide, inherit, YBlock) {
        var TmLogin = inherit(YBlock, {
            __constructor: function () {
                this.__base.apply(this, arguments);

                // здесь описываем то, что происходит сразу после создания инстанса класса
            }

            // инстанс-методы
        }, {
            getBlockName: function () {
                return 'TmLogin';
            }

            // статические методы
        });

        provide(TmLogin);
});

