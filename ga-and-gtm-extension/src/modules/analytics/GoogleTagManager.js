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

        performInit:  function () {
            if (this.shouldAddTag !== false) {
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

                dataLayer.push({'clientId': this.clientId});

            }
        },

        sendEvent: function (eventName, eventLabel, eventCategory) {


            eventCategory = eventCategory || this.config.eventCategory || '';

            var dataObject = {
                'event': eventName,
                'category': eventCategory,
                'label': eventLabel
            };

            if (typeof dataLayer !== 'undefined'){

                dataLayer.push(dataObject);

            } else {
                console.log("dataLayer is undefined");
            }
        }

    });


    return GoogleTagManager;
});