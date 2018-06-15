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

        performInit:  function () {

            if (this.shouldAddTag !== false) {
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

                var options = {
                    allowLinker: true
                };

                if (this.clientId !== null) {
                    options.clientId = this.clientId;
                }

                ga('create', this.config.trackingId || '', 'auto', options);
                ga('require', 'linker');
            }
        },

        sendEvent: function (eventName, eventLabel, eventCategory) {

            if (typeof ga === 'function') {

                eventCategory = eventCategory || this.config.eventCategory || '';

                ga('send', {
                    hitType: 'event',
                    eventCategory: eventCategory,
                    eventAction: eventName,
                    eventLabel: eventLabel
                });

            }
        }

    });

    return GoogleAnalytics;
});