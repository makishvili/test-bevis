var inherit = require('inherit');
var path = require('path');
var config = require('./config');
var assets = config.get('assets');
var vow = require('vow');
var logger = require('./logger');

var Page = inherit({
    /**
     * Страница
     *
     * @param {String} path - Относительный путь к готовой странице
     * @param {String} pageName - Имя страницы.
     * @param {Request} req - Объект запроса
     * @param {Response} res - Объект ответа
     */
    __constructor: function (path, pageName, req, res) {
        this._id = path;
        this._pageName = pageName;
        this._req = req;
        this._res = res;
        this._lang = req.query.lang || 'ru';
        this._query = req.query;
    },

    /**
     * создание страницы
     *
     * @returns {Promise} promise
     */
    handle: function () {
        return vow.all([
                this._getPages(),
                this._getTemplate()
            ])
            .spread(function (pages, template) {
                return pages.exec(this._pageName, {
                    query: this._query,
                    options: this._getPageOptions(),
                    lang: this._lang
                }).then(function (btJson) {
                    return this._applyTemplate(btJson, template);
                }.bind(this));
            }.bind(this));
    },

    /**
     * Возвращает обработчики страницы
     *
     * @returns {Promise} promise
     */
    _getPages: function () {
        return assets.requirePageAsset(this._buildAssetPath('page'));
    },

    /**
     * Возвращает bt шаблоны
     *
     * @returns {Promise} promise
     */
    _getTemplate: function () {
        return assets.requirePageAsset(this._buildAssetPath('bt'));
    },

    /**
     * Возвращает i18n
     *
     * @returns {Promise} promise
     */
    _getI18n: function () {
        return assets.requirePageAsset(this._buildAssetPath('lang.' + this._lang));
    },

    /**
     * Возвращает путь к технологии
     *
     * @param {String} tech
     * @returns {String} path
     */
    _buildAssetPath: function (tech) {
        return ['/', this._id, '/', path.basename(this._id), '.', tech, '.js'].join('');
    },

    /**
     * Возвращает путь до css и js файлов
     *
     * @returns {Object}
     */
    _getPageOptions: function () {
        return {
            assetsPath: [
                'host' in assets ? assets.host : '',
                '/', this._id, '/_', path.basename(this._id)
            ].join('')
        };
    },

    /**
     * Возвращает путь к технологии
     *
     * @param {Object} btJson
     * @param {BT} template
     * @returns {Promise} promise
     */
    _applyTemplate: function (btJson, template) {
        var startTime = Date.now();
        logger.verbose('bt running');
        var res = template.apply(btJson);
        logger.verbose('bt completed at %d ms', Date.now() - startTime);
        return res;
    }
}, {
    /**
     * @param {String} pageName
     */
    createHandler: function (pageName) {
        return function (req, res, next) {
            new Page('build/' + pageName, pageName + '-page', req, res)
                .handle()
                .then(
                    function (html) {
                        res.end(html);
                    },
                    next
                );
        };
    }
});

module.exports = Page;
