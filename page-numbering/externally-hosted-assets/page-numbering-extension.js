(function () {
  'use strict';

  var scriptTag = document.getElementById("ceros-page-numbering-extension"),

    // text to prefix page number with
    numberingPrefixStr = scriptTag.getAttribute("data-number-prefix") || '',

    // text to suffix page number with
    numberingSuffixStr = scriptTag.getAttribute("data-number-suffix") || '',

    // formatting string to use
    numberingFormattingStr = scriptTag.getAttribute("data-number-formatting") || '0',

    // offset to allow for cover/contents pages
    numberingOffsetStr = scriptTag.getAttribute("data-numbering-offset") || '0';


  // Parse and confirm offset is an integer
  var numberingOffset = parseInt(numberingOffsetStr);

  if (isNaN(numberingOffset)) {
    console.error("Page Numbering Offset must be a number");

    return;
  }


  require.config({
    paths: {
      CerosSDK: '//sdk.ceros.com/standalone-player-sdk-v4.min',
      numeral: '//cdnjs.cloudflare.com/ajax/libs/numeral.js/2.0.6/numeral.min'
    }
  });

  require(['CerosSDK', 'numeral'], function (CerosSDK, numeral) {

    CerosSDK.findExperience()
      .fail(function (error) {
        console.error(error);
      })
      .done(function (experience) {

        var pageNumberComponentCollection = experience.findComponentsByTag("page-number");

        var handlePageChange = function (page) {

          var pageNumber = page.getPageNumber(),

            // add offset
            numericalValue = (pageNumber + numberingOffset),

            // apply formatting
            formattedValue = numeral(numericalValue).format(numberingFormattingStr),

            // build string to use as result
            textValue = numberingPrefixStr + formattedValue + numberingSuffixStr;

          // for every text components with tag, set its value
          pageNumberComponentCollection.components.forEach(function (component) {

            if (component.isTextComponent()) {
              component.setText(textValue);
            }

          });

        };

        // Subscribe to events to change the page number when the page changes
        experience.subscribe(CerosSDK.EVENTS.PAGE_CHANGE, handlePageChange);

        // Call handler with 1st page to set initial state
        handlePageChange(experience.getCurrentPage());

      });

  });


})();