define(function () {
    /**
     * Class to wrap console.log for safe usage and easy disabling
     *
     * @param {Boolean} enabled
     * @constructor
     */
    var Logger = function (enabled) {
        this.enabled = enabled;
    };

    Logger.prototype = {
        /**
         * Log, if enabled
         *
         * @param {*} label
         * @param {*} value
         * @return {*}
         */
        log: function (label, value) {
            if (this.enabled) {
                return window.console && console.log && Function.apply.call(console.log, console, arguments);
            } else {
                return null;
            }
        }
    };


    return Logger;
});