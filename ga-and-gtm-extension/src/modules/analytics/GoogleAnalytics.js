define([
  'modules/analytics/AnalyticsBackend',
  'modules/analytics/GoogleAnalyticsHelper'
], function (AnalyticsBackend, GoogleAnalyticsHelper) {

    /**
     * Analytics Backend for Google Analytics
     *
     * @param {Object} config
     *
     * @class GoogleAnalytics
     * @extends AnalyticsBackend
     */
    var GoogleAnalytics = AnalyticsBackend.extend({

        performInit:  function () {
            (function (i, s, o, g, r, a, m) {
                i['GoogleAnalyticsObject'] = r;
                i[r] = i[r] || function () {
                    (i[r].q = i[r].q || []).push(arguments)
                }, i[r].l = 1 * new Date();
                a = s.createElement(o),
                  m = s.getElementsByTagName(o)[0];
                a.async = 1;
                a.src = g;
                m.parentNode.insertBefore(a, m)
            })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

            GoogleAnalyticsHelper.createCrossDomainTracker(this);
        },

        sendEvent: function (eventName, eventLabel) {

            if (typeof ga === 'function') {

                ga('send', {
                    hitType: 'event',
                    eventCategory: this.config.eventCategory || '',
                    eventAction: eventName,
                    eventLabel: eventLabel
                });

            }
        }

    });

    return GoogleAnalytics;
});