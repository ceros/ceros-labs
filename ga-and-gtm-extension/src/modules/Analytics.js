define([
    './analytics/GoogleAnalytics',
    './analytics/GoogleTagManager',
    './analytics/ParentPageMessenger',
    './constants'
], function (GoogleAnalytics, GoogleTagManager, ParentPageMessenger, constants) {

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

            if (config.backEnd && config.backEnd === constants.MODE_GOOGLE_TAG_MANAGER) {

                backend = new GoogleTagManager(config);

            } else if (config.backEnd && config.backEnd === constants.MODE_PARENT_PAGE_DELEGATE) {

                backend = new ParentPageMessenger(config);

            } else {

                backend = new GoogleAnalytics(config);

            }



            backend.init();

            return backend;
        }

    };

    return Analytics;
});