define([
    'modules/analytics/AnalyticsBackend',
    'modules/analytics/GoogleAnalyticsHelper'
], function (AnalyticsBackend, GoogleAnalyticsHelper) {

    /**
     * Analytics Backend for Google Tag Manager
     *
     * @param {Object} config
     *
     * @class GoogleTagManager
     * @extends AnalyticsBackend
     */
    var GoogleTagManager = AnalyticsBackend.extend({

        performInit:  function () {
            (function (w, d, s, l, i) {
                w[l] = w[l] || [];
                w[l].push({
                    'gtm.start': new Date().getTime(), event: 'gtm.js'
                });
                var f = d.getElementsByTagName(s)[0],
                  j = d.createElement(s), dl = l != 'dataLayer' ? '&l=' + l : '';
                j.async = true;
                j.src =
                  '//www.googletagmanager.com/gtm.js?id=' + i + dl;
                f.parentNode.insertBefore(j, f);
            })(window, document, 'script', 'dataLayer', this.config.trackingId || "");

            window.dataLayer.push({'clientId': this.clientId});

            // GTM requires cross domain tracking to be done directly with GA
            //GoogleAnalyticsHelper.createCrossDomainTracker(this);
        },

        sendEvent: function (eventName, eventLabel) {

            var dataObject = {
                'event': eventName,
                'category': this.config.eventCategory || '',
                'label': eventLabel
            };

            if (typeof dataLayer !== 'undefined'){
                dataLayer.push(dataObject);
            }
        }

    });


    return GoogleTagManager;
});