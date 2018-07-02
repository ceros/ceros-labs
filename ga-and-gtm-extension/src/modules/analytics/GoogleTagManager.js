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

            var dataObject = {};

            dataObject['event'] = 'ceros-event';            
            dataObject[this.config.eventCategoryParameter] = eventCategory;
            dataObject[this.config.eventActionParameter] = eventAction;
            dataObject[this.config.eventLabelParameter] = eventLabel;

            var dataLayerGlobal = this.config.dataLayerGlobal;

            if (typeof window[dataLayerGlobal] !== 'undefined'){

                window[dataLayerGlobal].push(dataObject);

            } else {
                console.error("dataLayer (as '" + dataLayerGlobal + "') is undefined");
            }
        }

    });


    return GoogleTagManager;
});