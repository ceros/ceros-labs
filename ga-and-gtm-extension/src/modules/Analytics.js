define([
    './analytics/GoogleAnalytics',
    './analytics/GoogleTagManager',
    './analytics/ParentPageMessenger',
    './constants',
], function (GoogleAnalytics, GoogleTagManager, ParentPageMessenger, constants) {

    // time to wait before auto initializing tracker
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

            var backend, initializeImmediately = false;

            if (config.backEnd && config.backEnd === constants.MODE_GOOGLE_TAG_MANGER) {

                backend = new GoogleTagManager(config);

            } else if (config.backEnd && config.backEnd === constants.MODE_PARENT_PAGE_DELEGATE) {

                backend = new ParentPageMessenger(config);

                initializeImmediately = true;

            } else {

                backend = new GoogleAnalytics(config);

            }


            if (initializeImmediately) {

                backend.init();

            } else {

                setTimeout(function() {

                    if (backend.clientId === null) {

                        if (config.logger) {
                            config.logger.log("Timed out waiting for Client ID from parent page via postMessage");
                        }

                        backend.init();
                    }

                }, threeSeconds);

            }

            return backend;
        }

    };

    return Analytics;
});