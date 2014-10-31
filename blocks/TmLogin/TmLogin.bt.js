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
                block: "Title"
            },
            {
                block: 'input',
                placeholder: 'Логин'
            },
            {
                block: 'input',
                placeholder: 'Пароль'
            },
            {
                block: 'button',
                view: 'color-blue',
                value: 'Войти'
            }
        ])
    });

    bt.match('TmLogin__Shadow', function (ctx)
    {
        ctx.setTag('div');
    })

};
