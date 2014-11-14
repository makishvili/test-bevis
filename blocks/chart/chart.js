modules.define(
    'chart',
    ['inherit', 'block', 'd3'],
    function (provide, inherit, YBlock, d3)
    {
        var chart = inherit(YBlock, {
            __constructor: function ()
            {

                /*
                 todo: добавить ховеры по значениям
                 сделать кнопки по дням
                 -- разбить данные по дням *
                 сделать автоапдейт
                 */

                var _th = this;
                _th.__base.apply(this, arguments);
                // здесь описываем то, что происходит сразу после создания инстанса класса

                // место куда впихнем графики
                _th.__view = this._findElement('view')[0];

                // место куда впихнем кнопки
                _th.__days = this._findElement('days');

                // todo впихнуть кнопки
                var xx = _th._createDomElement({
                    block: "button"
                });

                console.log(xx);

                // Данные
                var data = [];
                var days = [];
                var _time = 0;

                // Получаем данные
                $.ajax({
                    url: '/tm_proxy',
                    type: 'POST',
                    dataType: 'json',
                    data: '943456643%2C17%2C',
                    async: false, //todo убрать синхронный запрос
                    success: function (_data)
                    {
                        // преобразовываем время в обьектный вид
                        var time = new Date(_data.time);

                        var _time1 = new Date(time);
                        _time1.setMinutes(0);
                        _time1.setHours(0);
                        var _time2 = null;

                        var length = _data.value.length;

                        // проходим справа налево по массиву и сохраняем элементы с уменьшенным на одну минуту временем
                        _data.value.reduceRight(function (prev, elem, iter)
                        {
                            _time2 = new Date(time);
                            _time2.setMinutes(0);
                            _time2.setHours(0);

                            if (String(_time1) != String(_time2))  {
                                console.log("равны");
                                days.push(data);
                                _time1 = new Date(time);
                                _time1.setMinutes(0);
                                _time1.setHours(0);
                                data = [];
                            }
                            data.push({time: new Date(time), value: elem});
                            time.setMinutes(time.getMinutes() - 1);
                        });
                        days.push(data);
                    }
                });

                console.log(days);

                // определяем настройки языка
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
                        "days": ["воскресение", "понедельник", "вторник", "среда", "четверг", "пятница", "суббота"],
                        "shortDays": ["вс", "пн", "вт", "ср", "чт", "пт", "сб"],
                        "months": ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"],
                        "shortMonths": ["янв", "фев", "мар", "апр", "май", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"]
                    }
                );

                // устанавливаем размеры
                var
                    margin_focus = {top: 40, right: 40, bottom: 100, left: 40},
                    margin_select = {top: 470, right: 40, bottom: 20, left: 40},
                    width = $(_th.getDomNode()).width(),
                    height = 600,
                    height_focus = 400,
                    height_select = 50,
                    width_focus = width - margin_focus.right - margin_focus.left,
                    width_select = width - margin_select.right - margin_select.left;

                // создаем наш svg элемент
                var svg = d3
                    .select(_th.__view)
                    .append("svg")
                    .attr("width", width)
                    .attr("height", height);

                // добавляем контейнер для подробного графика
                var focus = svg.append("g")
                    .attr("class", "chart__focus")
                    .attr("width", width_focus)
                    .attr("height", height_focus)
                    .attr("transform", "translate(" + margin_focus.left + "," + margin_focus.top + ")");

                // контейнер для общего графика
                var select = svg.append("g")
                    .attr("class", "chart__select")
                    .attr("width", width_select)
                    .attr("height", height_select)
                    .attr("transform", "translate(" + margin_select.left + "," + margin_select.top + ")");

                // ограничение для area
                svg.append("defs").append("clipPath")
                    .attr("id", "clip")
                    .append("rect")
                    .attr("width", width_focus)
                    .attr("height", height_focus);

                // градиент
                var gradient = svg.append("defs").append("linearGradient")
                    .attr("id", "lineGradient")
                    .attr("x1", 0)
                    .attr("y1", 1)
                    .attr("x2", 0)
                    .attr("y2", 0);
                // шаги градиента
                gradient.append("stop")
                    .attr("style", "stop-color:#FFA000")
                    .attr("offset", "0");
                gradient.append("stop")
                    .attr("style", "stop-color:#FFA000")
                    .attr("offset", "20%");

                gradient.append("stop")
                    .attr("style", "stop-color:#F57C00")
                    .attr("offset", "20%");
                gradient.append("stop")
                    .attr("style", "stop-color:#F57C00")
                    .attr("offset", "50%");

                gradient.append("stop")
                    .attr("style", "stop-color:#E64A19")
                    .attr("offset", "50%");
                gradient.append("stop")
                    .attr("style", "stop-color:#E64A19")
                    .attr("offset", "100%");

                // шкалы для подробного графика
                var focus_x_scale = d3.time.scale().range([0, width_focus]),
                    focus_y_scale = d3.scale.linear().range([height_focus, 0]);

                // шкалы для общего графика
                var select_x_scale = d3.time.scale().range([0, width_select]),
                    select_y_scale = d3.scale.linear().range([height_select, 0]);

                // оси для подробного графика
                var focus_x_Axis = d3.svg.axis().scale(focus_x_scale).orient("bottom").tickFormat(RU.timeFormat("%a, %e %b, %H:%M")),
                    focus_y_Axis = d3.svg.axis().scale(focus_y_scale).orient("left");

                // ось для общего графика
                var select_x_Axis = d3.svg.axis().scale(select_x_scale).orient("bottom").tickFormat(RU.timeFormat("%a, %e %b, %H:%M"));

                // Генератор area для подробного графика
                var focus_area = d3.svg.area()
                    .x(function (d)
                    {
                        return focus_x_scale(d.time);
                    })
                    .y0(height_focus)
                    .y1(function (d)
                    {
                        return focus_y_scale(d.value);
                    });

                // Генератор area для общего графика
                var select_area = d3.svg.area()
                    .x(function (d)
                    {
                        return select_x_scale(d.time);
                    })
                    .y0(height_select)
                    .y1(function (d)
                    {
                        return select_y_scale(d.value);
                    });

                // выборка части общего графика
                var brush = d3.svg.brush()
                    .x(select_x_scale)
                    .on("brush", function ()
                    {
                        focus_x_scale.domain(brush.empty() ? focus_x_scale.domain() : brush.extent());

                        dom_focus_area.attr("d", focus_area);

                        focus_x_scale
                            .call(focus_x_Axis);
                        //focus_y_scale
                        //    .call(yAxis);
                    });

                // Домены для подробного графика
                focus_x_scale.domain([data[0].time, data[data.length - 1].time]);
                focus_y_scale.domain([0, 100]);

                // Домены для общего графика
                select_x_scale.domain(focus_x_scale.domain());
                select_y_scale.domain(focus_y_scale.domain());

                // Добавляем area для подробного графика
                var dom_focus_area = focus.append("path")
                    .datum(data)
                    .attr("class", "area")
                    .attr("d", focus_area);

                // Добавляем area для общего графика
                var dom_select_area = select.append("path")
                    .datum(data)
                    .attr("class", "area")
                    .attr("d", select_area);

                // добавляем шкалы для подробного графика
                var focus_x_dom = focus.append("g")
                        .attr("class", "x axis")
                        .attr("transform", "translate(0," + height_focus + ")")
                        .call(focus_x_Axis),

                    focus_y_dom = focus.append("g")
                        .attr("class", "y axis")
                        .call(focus_y_Axis);

                // добавляем шкалы для общего графика
                var select_x_dom = select.append("g")
                        .attr("class", "x axis")
                        .attr("transform", "translate(0," + height_select + ")")
                        .call(select_x_Axis),

                    select_y_dom = select.append("g")
                        .attr("class", "x brush")
                        .call(brush)
                        .selectAll("rect")
                        .attr("y", -6)
                        .attr("height", height_select + 7);
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

