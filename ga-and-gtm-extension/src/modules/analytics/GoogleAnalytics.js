define([
    './AnalyticsBackend'
], function (AnalyticsBackend) {

    /**
     * Analytics Backend for Google Analytics
     *
     * @param {Object} config
     *
     * @class GoogleAnalytics
     * @extends AnalyticsBackend
     */
    var GoogleAnalytics = AnalyticsBackend.extend({

        sendEvent: function (eventAction, eventLabel, eventCategory) {

            var gaGlobal = this.config.trackerGlobal;

            if (typeof window[gaGlobal] === 'function') {

                window[gaGlobal]('send', {
                    hitType: 'event',
                    eventCategory: eventCategory,
                    eventAction: eventAction,
                    eventLabel: eventLabel
                });

            } else {
                console.log("ga not found.");
            }
        }

    });

    return GoogleAnalytics;
});