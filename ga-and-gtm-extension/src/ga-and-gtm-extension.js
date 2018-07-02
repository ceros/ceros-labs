(function () {
    'use strict';

    var scriptTag = document.getElementById("ceros-ga-plugin"),
      scriptSrc = scriptTag.getAttribute("src"),
      scriptDirectory = "./";

    if (scriptSrc) {
        var path = scriptSrc.split('?')[0];

        scriptDirectory = path.split('/').slice(0, -1).join('/') + '/';
    }

    console.log(scriptDirectory);

    require.config({
        paths: {
            CerosSDK: "//sdk.ceros.com/standalone-player-sdk-v5.min",

            modules: scriptDirectory + "modules"
        }
    });

    require([
        'CerosSDK',

        'modules/constants',
        'modules/Analytics',
        'modules/BrowserDom',
        'modules/Logger'

    ], function (CerosSDK, constants, Analytics, BrowserDom, Logger) {

        var backEndMode = scriptTag.getAttribute("data-mode") || constants.MODE_GOOGLE_ANALYTICS,

            trackingId = scriptTag.getAttribute("data-tracking-id") || null,

            eventCategory = scriptTag.getAttribute("data-event-category") || 'ceros event',
            viewEventAction = scriptTag.getAttribute("data-view-event-action") || 'ceros view',
            clickEventAction = scriptTag.getAttribute("data-click-event-action") || 'ceros click',
            hoverEventAction = scriptTag.getAttribute("data-hover-event-action") || 'ceros hover',

            trackerGlobal = scriptTag.getAttribute("data-ga-tracker") || 'ga',
            dataLayerGlobal = scriptTag.getAttribute("data-data-layer") || 'dataLayer',

            debug = scriptTag.getAttribute("data-debug") || constants.NO,
            hoverTag = scriptTag.getAttribute("data-hover-tag") || constants.TAG_MOUSE_HOVER,
            clickTag = scriptTag.getAttribute("data-click-tag") || constants.TAG_MOUSE_CLICK,
            recordPageViews = scriptTag.getAttribute("data-record-page-views") || constants.NO;
            

        var consoleHelper = new Logger(debug === constants.YES),
            componentsWithHoverEvents = [];

        var analytics = Analytics.factory({
            trackingId: trackingId,
            backEnd: backEndMode,
            logger: consoleHelper,

            trackerGlobal: trackerGlobal,
            dataLayerGlobal: dataLayerGlobal,

            eventCategory: eventCategory,
            viewEventAction: viewEventAction,
            clickEventAction: clickEventAction,
            hoverEventAction: hoverEventAction
        });

        CerosSDK.findExperience()
          .fail(function (error) {
              console.error(error);
          })
          .done(function (experience) {

              var domHelper = new BrowserDom(experience);

              // SDK tagged hover and click components for GA tracking
              var hoverComponentCollection = experience.findComponentsByTag(hoverTag),
                clickComponentCollection = experience.findComponentsByTag(clickTag);

            var applyHoverListeners = function() {
              hoverComponentCollection.components.forEach(function (component) {
                    // check to see if this component has already been found and had a listener applied 
                    if (componentsWithHoverEvents.indexOf(component.id) === -1) {

                        // try to find the dom element (if it's on a page that hasn't loaded yet, it will be null)
                        var domElement = domHelper.getElementByComponentId(component.id);

                        if (domElement !== null) {
                          consoleHelper.log("Ceros Extension found new element for hover: #", component.id);
                          // Listen for mouse enter DOM event
                          domElement.addEventListener('mouseenter', function() {
                              consoleHelper.log("Ceros Extension fired hover event for: #", component.id);
                              analytics.recordHover(component.getPayload());
                          });

                          componentsWithHoverEvents.push(component.id);
                        }

                    }
                });
            };

            experience.on(CerosSDK.EVENTS.PAGE_CHANGING, applyHoverListeners);
            applyHoverListeners(experience.getCurrentPage());

            clickComponentCollection.on(CerosSDK.EVENTS.CLICKED, function (component) {
                consoleHelper.log("Ceros Extension fired click event for: #", component.id);

                analytics.recordClick(component.getPayload());
            });

            if (recordPageViews !== constants.NO) {

              var lastPageNumber = null; 

              var recordPageViewEvents = function(page) {
                // If we're only tracking 1st page view and this is one, or if we haven't just fired for this page
                if ((recordPageViews !== constants.FIRST_PAGE_VIEW_ONLY || lastPageNumber === null) && (lastPageNumber !== page.pageNumber)) {

                  var payload = page.getPayload(),
                    eventName;

                    // If the payload is empty, fallback to page number 
                    if (payload === '') {
                      eventName = 'page ' + page.pageNumber;
                    } else {
                      eventName = payload;
                    }

                  consoleHelper.log("Ceros Extension fired page event for: ", eventName);

                  analytics.recordPageView(eventName);

                  lastPageNumber = page.pageNumber;
                }

              };

              experience.on(CerosSDK.EVENTS.PAGE_CHANGED, recordPageViewEvents);
              recordPageViewEvents(experience.getCurrentPage());
            }

          });
    });
})();