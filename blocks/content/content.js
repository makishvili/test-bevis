modules.define(
    'content',
    ['inherit', 'block'],
    function (provide, inherit, YBlock) {
        var content = inherit(YBlock, {
            __constructor: function () {
                this.__base.apply(this, arguments);

                // здесь описываем то, что происходит сразу после создания инстанса класса
            }

            // инстанс-методы
        }, {
            getBlockName: function () {
                return 'content';
            }

            // статические методы
        });

        provide(content);
});

