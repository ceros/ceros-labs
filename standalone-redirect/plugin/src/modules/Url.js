/**
 * A module representing a URL.
 *
 * @module modules/Url
 */
define(function() {

    /**
     * Turn "?key=value" into {key: "value"}
     *
     * @param {string} queryString
     * @return {Object}
     */
    var parseQueryParams = function(queryString) {
        var params = {};

        if (queryString && queryString.length > 0) {
            queryString = queryString.substring(
                queryString.indexOf('?') + 1
            );

            var components = queryString.split('&');

            for (var i = 0; i < components.length; i++) {

                var paramParts = components[i].split('=');

                var paramName = decodeURIComponent(paramParts[0]),
                    paramValue = null;

                if (paramParts.length > 1) {
                    paramValue = decodeURIComponent(paramParts[1]);
                }

                params[paramName] = paramValue;
            }
        }

        return params;
    };

    /**
     * Turn {key: "value"} into "?key=value"
     *
     * @param {Object} queryParams
     * @return {string}
     */
    var serializeQueryParams = function(queryParams) {
        var queryString = "";

        var paramKeys = Object.keys(queryParams);

        if (paramKeys.length > 0) {

            paramKeys.forEach(function(paramKey) {

                if (queryString.length == 0) {
                    queryString += "?";
                } else {
                    queryString += "&";
                }

                queryString += encodeURIComponent(paramKey);

                if (queryParams[paramKey] !== null) {
                    queryString += "=" + encodeURIComponent(queryParams[paramKey]);
                }
            });
        }

        return queryString;
    };

    /**
     * @constructor
     * @alias module:modules/Url
     */
    var Url = function(uriString) {

        var anchor = document.createElement("a");
        anchor.href = uriString;

        this.protocol = anchor.protocol;
        this.host = anchor.host.replace(":80","/");
        this.pathname = anchor.pathname;
        this.fragment = anchor.hash;
        this.queryParams = parseQueryParams(anchor.search);
    };

    Url.prototype = {

        /**
         * Get URL's query string as a string
         *
         * @return {string}
         */
        getQueryString: function () {

            return serializeQueryParams(this.queryParams);

        },

        /**
         * Get URL as string
         *
         * @return {string}
         */
        toString: function() {
            return this.protocol + '//'
                + this.host
                + this.pathname
                + this.getQueryString()
                + this.fragment;
        },

        /**
         * Get current query params as an object
         *
         * @return {Object}
         */
        getQueryParams: function () {
            return this.queryParams;
        },

        /**
         * Get the value of a query parameter by its name
         *
         * @param {string} name
         * @return {*}
         */
        getQueryParam: function (name) {
            return this.queryParams[name];
        },

        /**
         * Set the value of a query parameter by its name
         *
         * @param {string} name
         * @param {*} value
         */
        setQueryParam: function (name, value) {
            this.queryParams[name] = value;
        }

    };

    return Url;
});
