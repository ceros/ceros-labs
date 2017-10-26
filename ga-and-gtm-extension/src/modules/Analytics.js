define([
    'modules/analytics/GoogleAnalytics',
    'modules/analytics/GoogleTagManager',
    'modules/constants',
], function (GoogleAnalytics, GoogleTagManager, constants) {

    // time to wait before auto initing tracker
    var threeSeconds = (3 * 1000);

    /**
     * Static class for initializing Analytics back ends
     *
     * @class Analytics
     * @static
     */
    var Analytics = {

        /**
         * Factory method of creating Analytics Backend based on config
         *
         * @param {Object} config
         * @return {AnalyticsBackend}
         */
        factory: function (config) {

            var backend;

            if (config.backEnd && config.backEnd === constants.MODE_GOOGLE_TAG_MANGER) {
                backend = new GoogleTagManager(config);
            } else {
                backend = new GoogleAnalytics(config);
            }

            setTimeout(function() {

                if (backend.clientId === null) {

                    if (config.logger) {
                        config.logger.log("Timed out waiting for Client ID from parent page via postMessage");
                    }

                    backend.init();
                }

            }, threeSeconds);

            return backend;
        }

    };

    return Analytics;
});