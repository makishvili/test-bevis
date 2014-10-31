modules.define(
    'button',
    ['inherit', 'block'],
    function (provide, inherit, YBlock) {
        var button = inherit(YBlock, {
            __constructor: function () {
                this.__base.apply(this, arguments);

                // здесь описываем то, что происходит сразу после создания инстанса класса
            }

            // инстанс-методы
        }, {
            getBlockName: function () {
                return 'button';
            }

            // статические методы
        });

        provide(button);
});

