modules.define(
    'datapicker',
    ['inherit', 'block'],
    function (provide, inherit, YBlock) {
        var datapicker = inherit(YBlock, {
            __constructor: function () {
                this.__base.apply(this, arguments);

                // здесь описываем то, что происходит сразу после создания инстанса класса
            }

            // инстанс-методы
        }, {
            getBlockName: function () {
                return 'datapicker';
            }

            // статические методы
        });

        provide(datapicker);
});

