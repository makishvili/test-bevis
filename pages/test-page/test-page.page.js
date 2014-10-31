module.exports = function (pages)
{
    pages.declare('test-page', function (params)
    {
        var options = params.options;
        return {
            block: 'page',
            title: 'test page',
            styles: [
                {url: options.assetsPath + '.css'}
            ],
            scripts: [
                {url: options.assetsPath + '.' + params.lang + '.js'}
            ],
            body: [
                {
                    block: "row",
                    content: [
                        {
                            block: 'button',
                            view: 'color-green'
                        },
                        {
                            block: 'button',
                            view: 'color-blue',
                            value: "ок"
                        }
                        ,
                        {
                            block: "spiner"
                        },
                        {
                            block: 'button',
                            view: 'color-red',
                            value: "ок"
                        }
                        ,
                        {
                            block: 'button',
                            view: 'color-orange',
                            value: "ок"
                        }
                        ,
                        {
                            block: 'button',
                            view: 'color-white',
                            value: "ок"
                        }
                    ]
                },
                {
                    block: "row",
                    content: [
                        {
                            block: 'button',
                            view: 'color-green'
                        },
                        {
                            block: 'button',
                            view: 'color-blue',
                            value: "ок"
                        }
                        ,
                        {
                            block: "spiner"
                        },
                        {
                            block: 'button',
                            view: 'color-red',
                            value: "ок"
                        }
                        ,
                        {
                            block: 'button',
                            view: 'color-orange',
                            value: "ок"
                        }
                        ,
                        {
                            block: 'button',
                            view: 'color-white',
                            value: "ок"
                        }
                    ]
                }, {
                    block: "row",
                    content: [
                        {
                            block: 'button',
                            view: 'size-S'
                        },
                        {
                            block: 'button',
                            view: 'size-M'
                        },
                        {
                            block: 'button',
                            view: 'size-L'
                        }
                        ,
                        {
                            block: 'button',
                            view: 'size-XL'
                        }
                        ,
                        {
                            block: 'button',
                            view: 'size-XXL'
                        }
                    ]
                },
                {
                    block: "row",
                    content: [
                        {
                            block: 'snake'
                        }
                    ]
                }
            ]
        };
    });
};
