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

        './modules/constants',
        './modules/CrossFrameMessenger',
        './modules/Analytics',
        './modules/Logger',
        './modules/URIParser'

    ], function (constants, CrossFrameMessenger, Analytics, Logger, URIParser) {

        var scriptTagUri = new URIParser(scriptSrc),
          scriptTagQuery = scriptTagUri.query();

        var backEndMode = scriptTag.getAttribute("data-mode") || scriptTagQuery.mode || constants.MODE_GOOGLE_ANALYTICS,
            debug = scriptTag.getAttribute("data-debug") || scriptTagQuery.debug || constants.NO,

            trackerGlobal = scriptTag.getAttribute("data-ga-tracker") || scriptTagQuery.gaTrackerName || 'ga',
            dataLayerGlobal = scriptTag.getAttribute("data-data-layer") || scriptTagQuery.dataLayerName || 'dataLayer',

            eventCategoryParameter = scriptTag.getAttribute("data-category-parameter") || scriptTagQuery.categoryParameter || 'cerosCategory',
            eventActionParameter = scriptTag.getAttribute("data-action-parameter") || scriptTagQuery.actionParameter || 'cerosAction',
            eventLabelParameter = scriptTag.getAttribute("data-label-parameter") || scriptTagQuery.labelParameter || 'cerosLabel';


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