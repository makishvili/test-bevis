modules.define(
    'row',
    ['inherit', 'block'],
    function (provide, inherit, YBlock) {
        var row = inherit(YBlock, {
            __constructor: function () {
                this.__base.apply(this, arguments);

                // здесь описываем то, что происходит сразу после создания инстанса класса
            }

            // инстанс-методы
        }, {
            getBlockName: function () {
                return 'row';
            }

            // статические методы
        });

        provide(row);
});

