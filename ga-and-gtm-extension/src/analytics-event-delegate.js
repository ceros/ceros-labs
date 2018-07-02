(function (root) {
    'use strict';

    var scriptTag = document.getElementById("ceros-event-delegate"),
        scriptSrc = scriptTag.getAttribute("src"),

        trackerGlobal = scriptTag.getAttribute("data-ga-tracker") || 'ga',
        dataLayerGlobal = scriptTag.getAttribute("data-data-layer") || 'dataLayer',

        eventCategoryParameter = scriptTag.getAttribute("data-category-parameter") || 'cerosCategory',
        eventActionParameter = scriptTag.getAttribute("data-action-parameter") || 'cerosAction',
        eventLabelParameter = scriptTag.getAttribute("data-label-parameter") || 'cerosLabel',

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

        './modules/constants',
        './modules/CrossFrameMessenger',
        './modules/Analytics',
        './modules/Logger'

    ], function (constants, CrossFrameMessenger, Analytics, Logger) {

        var backEndMode = scriptTag.getAttribute("data-mode") || constants.MODE_GOOGLE_ANALYTICS,
            debug = scriptTag.getAttribute("data-debug") || constants.NO;

        var incomingMessenger = new CrossFrameMessenger(constants.NAMESPACE_PREFIX),
            consoleHelper = new Logger(debug === constants.YES);

        var analytics = Analytics.factory({
            backEnd: backEndMode,

            eventCategoryParameter: eventCategoryParameter,
            eventActionParameter: eventActionParameter,
            eventLabelParameter: eventLabelParameter,

            trackerGlobal: trackerGlobal,
            dataLayerGlobal: dataLayerGlobal
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