(function (root) {
    'use strict';

    var scriptTag = document.getElementById("ceros-event-delegate");

    require([
        './modules/constants',
        './modules/CrossFrameMessenger',
        './modules/Analytics',
    ], function (constants, CrossFrameMessenger, Analytics) {

        var backEndMode = scriptTag.getAttribute("data-mode") || constants.MODE_GOOGLE_ANALYTICS;
        var incomingMessenger = new CrossFrameMessenger(constants.NAMESPACE_PREFIX);

        var analytics = Analytics.factory({
            addTag: false,
            backEnd: backEndMode
        });

        incomingMessenger.receive(constants.TYPE_DELEGATED_EVENT, function (message) {

            var eventCategory = message.eventCategory || '',
              eventName = message.eventName || '',
              eventLabel = message.eventLabel || '';

            analytics.sendEvent(eventName, eventLabel, eventCategory);
        });

        incomingMessenger.receive(constants.TYPE_GO_TO_URL, function (message) {

            if (message.url) {

                var url = message.url,
                  openInNewTab = message.openInNewTab || false;

                analytics.goToUrl(url, openInNewTab);
            }

        });

    });

})(window);