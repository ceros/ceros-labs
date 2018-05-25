define(function() {
    /**
     * A module for parsing a script tag into options, based on its attributes.
     *
     * @exports modules/Options
     */
    /*
     <script

         id="ceros-variant-redirect"
         src="../src/standalone-redirect.js"

         data-redirect-from="desktop|mobile"
         data-redirect-to="<URL>"
         data-break-on="touch|(view-port|user-agent)"

         data-min-width="<int>"

         data-preserve-page="<bool>"
         data-preserve-fragment="<bool>"
         data-preserve-query="<bool>"
         data-redirect-preview="<bool>"
         data-avoid-re-redirects="<bool>"
         data-should-log="<bool>"

     ></script>
     */
    var options = {

        isDesktop: null,
        altVariantUrl: null,

        breakOnTouch: true,
        breakOnViewPortWidth: false,
        breakOnUserAgent: false,

        minViewPortWidth: 500,

        preservePageNumber: true,
        preserveUrlFragment: false,
        preserveUrlQuery: false,

        forceHttps: false,

        redirectPreviewLinks: false,
        redirectToReferrer: false,

        shouldLog: false

    };

    // Common parameter prefixes
    var dataPrefix = "data-",
        preservePrefix = "preserve-";

    return function(htmlElement) {

        /**
         * Apply values from 'htmlElement' to 'options' based on mappings
         *
         * @param {Object} mappings
         * @param {Function=} transformValueFunction
         */
        var updateOptionsFromHtmlElement = function(mappings, transformValueFunction) {

            transformValueFunction = transformValueFunction || function(value) {
                return value;
            };

            Object.keys(mappings).forEach(function(key) {

                var attributeName = dataPrefix + mappings[key];

                if (htmlElement.hasAttribute(attributeName)) {

                    var value = transformValueFunction(
                        htmlElement.getAttribute(attributeName)
                    );

                    if (value !== null) {
                        options[key] = value;
                    }
                }

            });
        };

        updateOptionsFromHtmlElement({
            altVariantUrl: "redirect-to"
        });

        updateOptionsFromHtmlElement({
            isDesktop: "redirect-from"
        }, function (value) {
            if (value == "desktop" || value == "mobile") {
                return (value == "desktop");
            } else {
                return null;
            }
        });

        updateOptionsFromHtmlElement({
            minViewPortWidth: "min-width"
        }, function(value) {

            var intValue = parseInt(value);

            if (! isNaN(intValue)) {
                return intValue;
            } else {
                return null;
            }

        });

        updateOptionsFromHtmlElement({
            preservePageNumber: preservePrefix + "page",
            preserveUrlFragment: preservePrefix + "fragment",
            preserveUrlQuery: preservePrefix + "query",
            redirectPreviewLinks: "redirect-preview",
            redirectToReferrer: "avoid-re-redirects",
            shouldLog: "should-log",
            forceHttps: "force-https"
        }, function(value) {
            if (value == "yes" || value == "no") {
                return (value == "yes");
            } else {
                return null;
            }
        });


        var breakOnAttributeName = dataPrefix + "break-on";

        if (htmlElement.hasAttribute(breakOnAttributeName)) {
            var breakOnValue = htmlElement.getAttribute(breakOnAttributeName);

            if (breakOnValue == "view-port" || breakOnValue == "user-agent") {

                options.breakOnTouch = false;
                options.breakOnViewPortWidth = (breakOnValue == "view-port");
                options.breakOnUserAgent = (breakOnValue == "user-agent");

            }
        }

        return options;
    }
});
