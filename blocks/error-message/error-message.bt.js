module.exports = function (bt) {
    bt.match('error-message', function (ctx) {
        var error = ctx.getParam('error');

        var name = error.name;
        var type = error.type;
        var message = error.message;

        if (error.stack) {
            console.log(error.stack);
        }

        ctx.setContent([
            {
                elem: 'title',
                text: name || 'Ошибка'
            },
            {
                elem: 'type',
                text: type || 'Неизвестный'
            },
            {
                elem: 'message',
                text: message
            }
        ]);
    });

    bt.match('error-message__title', function (ctx) {
        ctx.setContent(ctx.getParam('text'));
    });

    bt.match('error-message__type', function (ctx) {
        ctx.setContent('Тип: ' + ctx.getParam('text'));
    });

    bt.match('error-message__message', function (ctx) {
        ctx.setContent('Текcт: ' + ctx.getParam('text'));
    });

};
