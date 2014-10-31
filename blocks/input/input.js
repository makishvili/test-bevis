modules.define(
    'input',
    ['inherit', 'block'],
    function (provide, inherit, YBlock) {
        var input = inherit(YBlock, {
            __constructor: function () {
                this.__base.apply(this, arguments);

                // здесь описываем то, что происходит сразу после создания инстанса класса
            }

            // инстанс-методы
        }, {
            getBlockName: function () {
                return 'input';
            }

            // статические методы
        });

        provide(input);
});

