(function () {
    'use strict';

    var scriptTag = document.getElementById("ceros-ga-plugin"),
      scriptSrc = scriptTag.getAttribute("src"),
      scriptDirectory = "./";

    if (scriptSrc) {
        var path = scriptSrc.split('?')[0];

        scriptDirectory = path.split('/').slice(0, -1).join('/') + '/';
    }

    require.config({
        paths: {
            CerosSDK: "//sdk.ceros.com/standalone-player-sdk-v4.min",

            modules: scriptDirectory + "modules"
        }
    });

    require([
        'CerosSDK',

        'modules/constants',
        'modules/Analytics',
        'modules/BrowserDom',
        'modules/CrossFrameMessenger',
        'modules/Logger'

    ], function (CerosSDK, constants, Analytics, BrowserDom, CrossFrameMessenger, Logger) {

        var backEndMode = scriptTag.getAttribute("data-mode") || constants.MODE_GOOGLE_ANALYTICS,
            trackingId = scriptTag.getAttribute("data-tracking-id") || null,
            eventCategory = scriptTag.getAttribute("data-event-category") || 'ceros-event',
            openLinksInNewTab = scriptTag.getAttribute("data-open-new-tab") || constants.NO,
            debug = scriptTag.getAttribute("data-debug") || constants.NO,
            hoverTag = scriptTag.getAttribute("data-hover-tag") || constants.TAG_MOUSE_HOVER,
            linkTag = scriptTag.getAttribute("data-link-tag") || constants.TAG_LINK,
            clickTag = scriptTag.getAttribute("data-click-tag") || constants.TAG_MOUSE_CLICK;

        var consoleHelper = new Logger(debug === constants.YES);

        var analytics = Analytics.factory({
            trackingId: trackingId,
            backEnd: backEndMode,
            logger: consoleHelper,
            eventCategory: eventCategory
        });

        consoleHelper.log("analytics: ", analytics);

        var messenger = new CrossFrameMessenger(constants.NAMESPACE_PREFIX, window.parent);

        messenger.receive(constants.TYPE_RECEIVE_CLIENT_ID, function (clientIdData) {
            consoleHelper.log("Ceros Extension received: ", clientIdData);

            if (clientIdData.isAvailable && clientIdData.clientId) {
                analytics.setClientId(clientIdData.clientId);
            }

            analytics.init();

        });

        messenger.send(constants.TYPE_REQUEST_CLIENT_ID);

        CerosSDK.findExperience()
          .fail(function (error) {
              console.error(error);
          })
          .done(function (experience) {

              var domHelper = new BrowserDom(experience);

              // SDK tagged hover and click components for GA tracking
              var hoverComponentCollection = experience.findComponentsByTag(hoverTag),
                linkComponentCollection = experience.findComponentsByTag(linkTag),
                clickComponentCollection = experience.findComponentsByTag(clickTag);

              hoverComponentCollection.components.forEach(function (component) {

                  var domElement = domHelper.getElementByComponentId(component.id);

                  if (domElement === null) {
                      console.error("Element unable to be located.");

                      return;
                  }

                  // Listen for mouse enter DOM event
                  domElement.addEventListener('mouseenter', function() {
                      analytics.recordHover(component.getPayload());
                  });
              });

              clickComponentCollection.subscribe(CerosSDK.EVENTS.CLICKED, function (component) {
                  analytics.recordClick(component.getPayload());
              });

              linkComponentCollection.subscribe(CerosSDK.EVENTS.CLICKED, function (component) {

                  var url = component.getPayload();

                  if (url) {
                      var destinationUrl = analytics.decorateUrl(url);

                      if (openLinksInNewTab === constants.NO) {
                          window.top.location.href = destinationUrl;
                      } else {
                          window.open(destinationUrl, '_blank');
                      }

                  }

              });
          });
    });
})();