define([
    './AnalyticsBackend',
], function (AnalyticsBackend) {

    /**
     * Analytics Backend for Google Tag Manager
     *
     * @param {Object} config
     *
     * @class GoogleTagManager
     * @extends AnalyticsBackend
     */
    var GoogleTagManager = AnalyticsBackend.extend({

        sendEvent: function (eventAction, eventLabel, eventCategory) {

            var dataObject = {
                'event': eventAction,
                'category': eventCategory,
                'label': eventLabel
            };

            var dataLayer = this.config.dataLayerGlobal;

            if (typeof window[dataLayer] !== 'undefined'){

                window[dataLayer].push(dataObject);

            } else {
                console.log("dataLayer is undefined");
            }
        }

    });


    return GoogleTagManager;
});