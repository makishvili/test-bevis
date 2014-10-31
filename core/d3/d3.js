/**
 * Загружает (если нет на странице) и предоставляет d3.
 */

/* global d3 */
modules.define(
    'd3',
    ['load-script', 'd3__config'],
    function (provide, loadScript, config) {

        if (typeof d3 !== 'undefined') {
            provide(d3);
        } else {
            loadScript(config.url, function () {
                provide(d3);
            });
        }
    });
