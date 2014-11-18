modules.define(
    'select',
    ['inherit', 'block'],
    function (provide, inherit, YBlock) {
        var select = inherit(YBlock, {
            __constructor: function () {
                this.__base.apply(this, arguments);

                // здесь описываем то, что происходит сразу после создания инстанса класса
            }

            // инстанс-методы
        }, {
            getBlockName: function () {
                return 'select';
            }

            // статические методы
        });

        provide(select);
});

