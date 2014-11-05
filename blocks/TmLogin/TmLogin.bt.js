module.exports = function (bt)
{

    bt.match('TmLogin', function (ctx)
    {
        ctx.setTag('div');

        ctx.setContent([
            {elem: "Form"},
            {elem: "Shadow"}
        ]);
    });

    bt.match('TmLogin__Form', function (ctx)
    {
        ctx.setTag('div');
        ctx.setContent([
            {
                block: 'row',
                content: [
                    {
                        block: 'input',
                        placeholder: 'Логин'
                    }
                ]
            }
            ,
            {
                block: 'row',
                content: [
                    {
                        block: 'input',
                        placeholder: 'Пароль'
                    }
                ]
            },
            {
                block: 'row',
                content: [
                    {
                        block: 'button',
                        view: 'color-blue',
                        value: 'Войти'
                    },
                    {
                        block: 'button',
                        view: 'color-red',
                        value: 'Получить Доступ'
                    }
                ]
            }

        ])
    });

    bt.match('TmLogin__Shadow', function (ctx)
    {
        ctx.setTag('div');
    })

};
