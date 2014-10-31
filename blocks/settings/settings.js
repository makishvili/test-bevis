modules.define(
    'settings',
    ['inherit', 'block'],
    function (provide, inherit, YBlock) {
        var settings = inherit(YBlock, {
            __constructor: function () {
                this.__base.apply(this, arguments);

                // здесь описываем то, что происходит сразу после создания инстанса класса
            }

            // инстанс-методы
        }, {
            getBlockName: function () {
                return 'settings';
            }

            // статические методы
        });

        provide(settings);
});

