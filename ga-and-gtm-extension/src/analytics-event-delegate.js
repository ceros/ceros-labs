(function (root) {
    'use strict';

    var scriptTag = document.getElementById("ceros-event-delegate"),
        scriptSrc = scriptTag.getAttribute("src"),
        scriptDirectory = "./";

    if (scriptSrc) {
        var path = scriptSrc.split('?')[0];

        scriptDirectory = path.split('/').slice(0, -1).join('/') + '/';
    }


    require.config({
        paths: {
            modules: scriptDirectory + "modules"
        }
    });

    require([

        './modules/constants.js',
        './modules/CrossFrameMessenger.js',
        './modules/Analytics.js',
        './modules/Logger.js'

    ], function (constants, CrossFrameMessenger, Analytics, Logger) {

        var backEndMode = scriptTag.getAttribute("data-mode") || constants.MODE_GOOGLE_ANALYTICS,
            debug = scriptTag.getAttribute("data-debug") || constants.NO;

        var incomingMessenger = new CrossFrameMessenger(constants.NAMESPACE_PREFIX),
            consoleHelper = new Logger(debug === constants.YES);

        var analytics = Analytics.factory({
            addTag: false,
            backEnd: backEndMode
        });

        incomingMessenger.receive(constants.TYPE_DELEGATED_EVENT, function (message) {

            var eventCategory = message.eventCategory || '',
              eventName = message.eventName || '',
              eventLabel = message.eventLabel || '';

            consoleHelper.log('Delegated Event: ', [eventName, eventLabel, eventCategory]);

            analytics.sendEvent(eventName, eventLabel, eventCategory);
        });

    });

})(window);