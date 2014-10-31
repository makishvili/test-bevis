modules.define(
    'chart',
    ['inherit', 'block', 'd3'],
    function (provide, inherit, YBlock, d3)
    {
        var chart = inherit(YBlock, {
            __constructor: function ()
            {
                this.__base.apply(this, arguments);
                // здесь описываем то, что происходит сразу после создания инстанса класса

                var
                    data = [],
                    date = 0,
                    DateToValue = {},
                    max = 0;

                var RU = d3.locale(
                    {
                        "decimal": ",",
                        "thousands": "\xa0",
                        "grouping": [3],
                        "currency": ["", " руб."],
                        "dateTime": "%A, %e %B %Y г. %X",
                        "date": "%d.%m.%Y",
                        "time": "%H:%M:%S",
                        "periods": ["AM", "PM"],
                        "days": ["воскресен", "понедельник", "вторник", "среда", "четверг", "пятница", "суббота"],
                        "shortDays": ["вс", "пн", "вт", "ср", "чт", "пт", "сб"],
                        "months": ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"],
                        "shortMonths": ["янв", "фев", "мар", "апр", "май", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"]
                    }
                );


                // устанавливаем размеры
                var margin = {top: 10, right: 30, bottom: 100, left: 40},
                    margin2 = {top: 430, right: 10, bottom: 20, left: 40},
                    width = $(window).width() - margin.left - margin.right,
                    height = 500 - margin.top - margin.bottom,
                    height2 = 500 - margin2.top - margin2.bottom,

                    focus_area, focus_x, focus_y,
                    context_area, context_x, context_y,

                    x = d3.time.scale().range([0, width]),
                    x2 = d3.time.scale().range([0, width]),
                    y = d3.scale.linear().range([height, 0]),
                    y2 = d3.scale.linear().range([height2, 0]),

                    xAxis = d3.svg.axis().scale(x).orient("bottom").tickFormat(RU.timeFormat("%a, %e %b, %H:%M")),
                    xAxis2 = d3.svg.axis().scale(x2).orient("bottom").tickFormat(RU.timeFormat("%a, %e %b, %H:%M")),
                    yAxis = d3.svg.axis().scale(y).orient("left"),

                    brush = d3.svg.brush()
                        .x(x2)
                        .on("brushend", brushed),

                    area = d3.svg.area()
                        .x(function (d)
                        {
                            return x(d.date);
                        })
                        .y0(height)
                        .y1(function (d)
                        {
                            return y(d.value);
                        }),

                    area2 = d3.svg.area()
                        .x(function (d)
                        {
                            return x2(d.date);
                        })
                        .y0(height2)
                        .y1(function (d)
                        {
                            return y2(d.value);
                        }),

                    svg = d3.select(".chart").append("svg")
                        .attr("width", width + margin.left + margin.right)
                        .attr("height", height + margin.top + margin.bottom);

                svg.append("defs").append("clipPath")
                    .attr("id", "clip")
                    .append("rect")
                    .attr("width", width)
                    .attr("height", height);

                var focus = svg.append("g")
                        .attr("class", "focus")
                        .attr("transform", "translate(" + margin.left + "," + margin.top + ")"),

                    context = svg.append("g")
                        .attr("class", "context")
                        .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

                getData(function (_data)
                {
                    // преобразовываем время в обьектный вид
                    date = new Date(_data.time);

                    // вычитываем последний элемент и сохраняем
                    var value_l = _data.value.length,
                        val_bef = _data.value[value_l - 1];

                    data[value_l - 1] = {date: new Date(date), value: val_bef};
                    DateToValue[new Date(date) + ""] = val_bef;

                    max = (max > val_bef) ? max : val_bef;

                    // проходим справа налево по массиву и сохраняем элементы с уменьшенным на одну минуту временем
                    _data.value.reduceRight(function (prev, elem, iter)
                    {
                        date.setMinutes(date.getMinutes() - 1);
                        data[iter] = {date: new Date(date), value: elem};
                        DateToValue[new Date(date) + ""] = elem;
                        max = (max > elem) ? max : elem;
                    });

                    // возвращаем исходное значение для даты последнего замера
                    date = new Date(_data.time);

                    // рисуем график
                    DrawChart();
                });

                var interval = setInterval(function ()
                {
                    getData(refresh);
                }, 60000);

                // получаем данные
                function getData(handler)
                {
                    $.ajax({
                        url: '/tm_proxy',
                        type: 'POST',
                        dataType: 'json',
                        data: '943456643%2C17%2C',
                        success: function (_data)
                        {
                            handler(_data);
                        }
                    });
                }

                // обновляем график
                function refresh(_data)
                {
                    date.setMinutes(date.getMinutes() + 1);
                    delete DateToValue[data[0].date];
                    data = data.slice(1);
                    var val = _data.value[_data.value.length - 1];
                    data[data.length] = {date: new Date(date), value: val};
                    DateToValue[new Date(date) + ""] = val;

                    max = (max > val) ? max : val;

                    focus_area
                        .datum(data);

                    context_area
                        .datum(data);

                    x2.domain([data[0].date, data[data.length - 1].date]);

                    y2.domain([0, max]);

                    context_area.attr("d", area2);
                    context_x.call(xAxis2);
                }

                // рисуем график
                function DrawChart()
                {
                    x.domain([data[0].date, data[data.length - 1].date]);
                    y.domain([0, max]);

                    x2.domain(x.domain());
                    y2.domain(y.domain());

                    focus_area = focus.append("path")
                        .datum(data)
                        .attr("class", "area")
                        .attr("d", area);

                    focus_x = focus.append("g")
                        .attr("class", "x axis")
                        .attr("transform", "translate(0," + height + ")")
                        .call(xAxis);

                    focus_y = focus.append("g")
                        .attr("class", "y axis")
                        .call(yAxis);

                    context_area = context.append("path")
                        .datum(data)
                        .attr("class", "area")
                        .attr("d", area2);

                    context_x = context.append("g")
                        .attr("class", "x axis")
                        .attr("transform", "translate(0," + height2 + ")")
                        .call(xAxis2);

                    context_y = context.append("g")
                        .attr("class", "x brush")
                        .call(brush)
                        .selectAll("rect")
                        .attr("y", -6)
                        .attr("height", height2 + 7);
                }

                // отоброжение выбронного участка на большом графике
                function brushed()
                {
                    var
                        val = [],
                        start = new Date(brush.extent()[0].setSeconds(0)),
                        end = (new Date(brush.extent()[1].setSeconds(0))) + "";

                    function recurs()
                    {
                        var _start = start + "";
                        if (_start != end) {
                            val.push(DateToValue[_start]);
                            start.setMinutes(start.getMinutes() + 1);
                            recurs()
                        } else {
                            return void(0);
                        }
                    }

                    recurs();

                    x.domain(brush.empty() ? x2.domain() : brush.extent());
                    y.domain([0, d3.max(val)]);
                    focus_area.attr("d", area);
                    focus_x.call(xAxis);
                    focus_y.call(yAxis);
                }

            }

            // инстанс-методы
        }, {
            getBlockName: function ()
            {
                return 'chart';
            }

            // статические методы
        });

        provide(chart);
    });

