modules.define(
    'chart',
    ['inherit', 'block', 'd3', 'bt'],
    function (provide, inherit, Block, d3, bt)
    {
        var chart = inherit(Block, {
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

                // место куда впихнем значения по точкам
                _th.__value = this._findElement('value');

                this._container = this.getDomNode();

                this._button = this._findElement('button');
                this._bindTo(this._button, 'click', this._onButtonClicked, this);

                // Данные
                var data = [];
                var days = [];
                var _time = 0;
                // объект значений подробного графика в виде "x": y, ...
                var value_area = [];

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

                            if (String(_time1) != String(_time2)) {
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

                // форматер времени
                var format = RU.timeFormat("%H:%M");

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
                var focus_x_Axis = d3.svg.axis().scale(focus_x_scale).orient("bottom").tickFormat(RU.timeFormat("%e %b, %H:%M")),
                    focus_y_Axis = d3.svg.axis().scale(focus_y_scale).orient("left");

                // ось для общего графика
                var select_x_Axis = d3.svg.axis().scale(select_x_scale).orient("bottom").tickFormat(RU.timeFormat("%e %b, %H:%M"));

                // Генератор area для подробного графика
                var focus_area = d3.svg.area()
                    .x(function (d)
                    {
                        var x = focus_x_scale(d.time),
                            y = focus_y_scale(d.value);
                        if (x > 0 && x < width_focus) {
                            value_area.push({"x": x, "y": y, "time": format(d.time), "value": d.value});
                        }
                        return x;
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

                        value_area = [];
                        focus_x_scale.domain(brush.empty() ? focus_x_scale.domain() : brush.extent());
                        dom_focus_area.attr("d", focus_area);


                        focus_x_dom
                            .call(focus_x_Axis);

                        draw_circle();

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

                draw_circle();

                function draw_circle()
                {
                    svg.selectAll(".hovered").remove();

                    svg.selectAll("circle")
                        .data(value_area)
                        .enter()
                        .append("circle")
                        .attr("r", 3.5)
                        .attr("class", "hovered")
                        .attr("transform", "translate(" + margin_focus.left + "," + margin_focus.top + ")")
                        .attr("cx", function (d)
                        {
                            return d.x
                        })
                        .attr("cy", function (d)
                        {
                            return d.y
                        });

                    svg.selectAll(".hovered").on(
                        "mouseover", function (d)
                        {
                            _th.__value.html("Время: " + d.time + "</br>Значение: " + d.value).css("opacity",1);
                        }
                    );
                    svg.selectAll(".hovered").on(
                        "mouseout", function (d)
                        {
                            _th.__value.css("opacity",0);
                        }
                    )
                }

            },

            _onButtonClicked: function () {
                // Налету создаём блок
                var errorMessage = bt.apply({
                    block: 'error-message',
                    error: {
                        name: 'Фейковая ошибка',
                        type: '909',
                        message: 'нажали на кнопку, создали новый блок и встроили в страницу'
                    }
                });

                // Добавляем в контейнер
                this._container.append(errorMessage);
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

