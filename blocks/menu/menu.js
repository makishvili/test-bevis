modules.define(
    'menu',
    ['inherit', 'block'],
    function (provide, inherit, YBlock) {
        var menu = inherit(YBlock, {
            __constructor: function () {
                this.__base.apply(this, arguments);

                // здесь описываем то, что происходит сразу после создания инстанса класса
            }

            // инстанс-методы
        }, {
            getBlockName: function () {
                return 'menu';
            }

            // статические методы
        });

        provide(menu);
});

