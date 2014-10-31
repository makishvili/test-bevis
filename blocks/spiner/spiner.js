modules.define(
    'spiner',
    ['inherit', 'block'],
    function (provide, inherit, YBlock) {
        var spiner = inherit(YBlock, {
            __constructor: function () {
                this.__base.apply(this, arguments);

                // здесь описываем то, что происходит сразу после создания инстанса класса
            }

            // инстанс-методы
        }, {
            getBlockName: function () {
                return 'spiner';
            }

            // статические методы
        });

        provide(spiner);
});

