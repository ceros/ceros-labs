define(function () {

    /**
     * Helper class to contain common code between GA and GTM
     *
     * @class GoogleAnalyticsHelper
     * @static
     */
    var GoogleAnalyticsHelper = {

        /**
         *
         * @param {AnalyticsBackend} backend
         */
        createCrossDomainTracker: function (backend) {
            if (typeof ga === 'function') {
                var options = {
                    allowLinker: true
                };

                if (backend.clientId !== null) {
                    options.clientId = backend.clientId;
                }

                ga('create', backend.config.trackingId || '', 'auto', options);

                ga('require', 'linker');
            }
        }
    };

    return GoogleAnalyticsHelper;
});