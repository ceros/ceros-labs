(function(){
    var populateFrame = function() {

        // Component parts of all attributes used
        var dataPrefix  = "data-",
            largePrefix = "lg-",
            smallPrefix = "sm-",
            breakOn     = 'break-on',
            id          = 'id',
            src         = 'src',
            padding     = 'padding';

        // List of all attributes without the 'data-' prefix
        var allAttrs = [
            breakOn,

            largePrefix + id,
            largePrefix + src,
            largePrefix + padding,

            smallPrefix + id,
            smallPrefix + src,
            smallPrefix + padding
        ];

        // Find ceros iframe elements
        var cerosFrames = document.querySelectorAll("iframe.ceros-experience");

        // For every Ceros iframe element that was found
        for (var i = 0; i < cerosFrames.length; i++) {

            var cerosFrame     = cerosFrames[i],
                // The iframe's parent div
                cerosContainer = cerosFrame.parentNode;

            // Test to see if all correct attributes are defined
            var allAttributesSet = true;
            // For every attribute
            for (a = 0; a < allAttrs.length; a++) {

                var currentAttr = allAttrs[a],
                    attrValue   = cerosContainer.getAttribute(dataPrefix + currentAttr);

                // If attribute is not set
                if (attrValue === null) {
                    allAttributesSet = false;

                    // Break out of the loop checking attributes
                    break;
                }
            }

            // If all the attributes were set
            if (allAttributesSet) {
                var isMobile,
                    sizePrefix,
                    breakPoint = cerosContainer.getAttribute(dataPrefix + breakOn);

                // If we are detecting touch events and not browser window size
                if (breakPoint == "touch") {
                    isMobile = ('ontouchstart' in window || navigator.maxTouchPoints);
                } else { // If we are detected window size and not touch events

                    // Calculate the window's width and convert the supplied break point into an int
                    var windowWidth = screen.width||window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
                        breakPointInt = parseInt(breakPoint);

                    console.log(windowWidth);

                    // If the breakPointInt was successfully converted to Int
                    if (breakPointInt) {
                        // Check to see if the window's width is smaller than or equal to the break point
                        isMobile = (windowWidth <= breakPointInt);
                    } else {
                        // If we couldn't make the break point an Int, log the error and move on
                        console.error("Unable to parse break point integer");

                        continue;
                    }
                };

            } else {
                // If not all attributes set, log error and move to next embed
                console.error("Ceros Embed Tag is missing attribute/s.");

                continue;
            }

            // Select 'data-sm-' or 'data-lg-' if we are on mobile or not
            if (isMobile) {
                sizePrefix = dataPrefix + smallPrefix;
            } else {
                sizePrefix = dataPrefix + largePrefix;
            }

            console.log(sizePrefix);

            // Set the correct src attribute on the iframe
            cerosFrame.setAttribute(src, cerosContainer.getAttribute(sizePrefix + src));

            // Set the correct id attribute on the iframe's parent DIV
            cerosContainer.setAttribute(id, cerosContainer.getAttribute(sizePrefix + id));

            // Set the correct padding-bottom CSS on the iframe's parent DIV
            cerosContainer.style["padding-bottom"] = cerosContainer.getAttribute(sizePrefix + padding);

        }

    };

    // in case the document is already rendered
    if (document.readyState != 'loading') {
        populateFrame();
    // modern browsers
    } else if (document.addEventListener) {
        document.addEventListener('DOMContentLoaded', populateFrame);
    // IE <= 8
    } else {
        document.attachEvent('onreadystatechange', function(){
            if (document.readyState == 'complete') {
                populateFrame();
            }
        });
    }
})();
