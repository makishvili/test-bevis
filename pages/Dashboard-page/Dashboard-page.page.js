module.exports = function (pages)
{
    pages.declare('Dashboard-page', function (params)
    {
        var options = params.options;
        return {
            block: 'page',
            title: 'Dashboard page',
            styles: [
                {url: options.assetsPath + '.css'}
            ],
            scripts: [
                {url: options.assetsPath + '.' + params.lang + '.js'}
            ],
            body: [
                {
                    block: "menu"
                },
                {
                    block: "content",
                    content: [
                        {
                            block: "chart"
                        },
                        {
                            block: "chart"
                        },
                        {
                            block: "chart"
                        }
                    ]
                }

            ]
        };
    });
};
