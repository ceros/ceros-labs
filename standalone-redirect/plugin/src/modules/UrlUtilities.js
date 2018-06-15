define(function() {
    /**
     * A module containing some utility functions.
     *
     * @exports modules/UrlUtilities
     */

    var pageNumberExpression = new RegExp("/p/([0-9]+)$", "i");

    var PROTOCOL_HTTPS = "https:",
        PROTOCOL_HTTP  = "http:";

    return {

        /**
         * Test URL to see if it is of a Preview Link
         *
         * @param {Url} url
         * @return {boolean}
         */
        isCerosPreview: function (url) {
            return (url.toString().indexOf("preview.ceros.com") > -1);
        },

        /**
         * Merge URL params from source into target
         *
         * @param {Url} source
         * @param {Url} target
         */
        mergeQueryParams: function (source, target) {

            var paramNames = Object.keys(source.getQueryParams());

            paramNames.forEach(function(paramName) {
                target.setQueryParam(
                    paramName,
                    source.getQueryParam(paramName)
                );
            });
        },

        /**
         * Copy source URL's fragment to target URL
         *
         * @param {Url} source
         * @param {Url} target
         */
        copyUrlFragment: function (source, target) {
            target.fragment = source.fragment;
        },


        /**
         * Get the Ceros page number from the supplied URL
         *
         * @param {Url} url
         * @param {int=1} defaultPageNumber
         * @return {int}
         */
        getPageNumberFromUrl: function (url, defaultPageNumber) {

            defaultPageNumber = defaultPageNumber || 1;

            var matches = url.pathname.match(pageNumberExpression);

            if (matches && matches.length > 1) {

                var pageNumber = parseInt(matches[1]);

                if (! isNaN(pageNumber)) {
                    return pageNumber;
                }

            }

            return defaultPageNumber;
        },

        /**
         * Set the Ceros page number in the given URL
         *
         * @param {Url} url
         * @param {int} pageNumber
         */
        setPageNumber: function (url, pageNumber) {

            var urlSuffix = '/p/' + encodeURIComponent(pageNumber.toString()),
                currentPathName = url.pathname;

            var matches = currentPathName.match(pageNumberExpression);

            if (matches && matches.length > 1) {
                url.pathname = currentPathName.replace(pageNumberExpression, urlSuffix);
            } else {

                // Trim off any trailing slashes
                if (currentPathName.slice(-1) === '/') {
                    currentPathName = currentPathName.slice(0, -1);
                }

                url.pathname = currentPathName + urlSuffix;
            }
        },

        /**
         * Is the URL using HTTPS?
         *
         * @param {Url} url
         * @return {boolean}
         */
        isSecure: function (url) {
            return (url.protocol == PROTOCOL_HTTPS);
        },

        /**
         * Switch the URL to using a secure protocol, or not
         *
         * @param {Url} url
         * @param {boolean=true} secure
         */
        setSecure: function (url, secure) {
            secure = secure || true;

            if (secure) {
                url.protocol = PROTOCOL_HTTPS;
            } else {
                url.protocol = PROTOCOL_HTTP;
            }
        },

        /**
         * Compare two URLs
         *
         * @param {Url} urlx
         * @param {Url} urly
         * @return {boolean}
         */
        isEqual: function (urlx, urly) {
            return (urlx.toString() == urly.toString());
        },

        /**
         * Redirect to URL
         *
         * @param {Url} url
         */
        redirectTo: function (url) {
            location.href = url.toString();
        }
    };
});