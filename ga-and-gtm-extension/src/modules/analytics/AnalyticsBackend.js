define(function () {

    /**
     * Abstract Analytics Backend
     *
     * @param {Object} config
     *
     * @class AnalyticsBackend
     * @abstract
     */
    var Abstract = function(config) {
        this.config = config;
        this.clientId = config.clientId || null;
        this.initalized = false;
    };

    Abstract.prototype = {

        /**
         * Initialize Backend
         *
         */
        init: function () {

            if (this.initalized === false) {
                this.performInit();
                this.initalized = true;
            }

        },

        /**
         * Hook for subclasses to override
         *
         */
        performInit: function () {

        },

        /**
         * Set the linker param to use
         *
         * @param {String} clientId
         */
        setClientId: function (clientId) {
            this.clientId = clientId;
        },

        /**
         *  Send event to back end
         *
         * @abstract
         * @param {String} eventName
         * @param {String} eventLabel
         */
        sendEvent: function (eventName, eventLabel) {

        },

        /**
         * Add Linker ID to given URL
         *
         * @param {String} url
         * @return {String}
         */
        decorateUrl: function (url) {

            if (this.clientId !== null) {
                url = this.setParamInUrl(url, 'linkerParam', this.clientId);
            }

            return url;
        },

        /**
         * Record Click for given Hot Spot Payload
         *
         * @param {String} hotSpotPayLoad
         */
        recordClick: function (hotSpotPayLoad) {
            this.sendEvent('ceros_click', hotSpotPayLoad);
        },

        /**
         * Record Hover for given Hot Spot Payload
         *
         * @param {String} hotSpotPayLoad
         */
        recordHover: function (hotSpotPayLoad) {
            this.sendEvent('ceros_hover', hotSpotPayLoad);
        },

        /**
         * Record Page View for given Page Payload
         *
         * @param {String} pageReference
         */
        recordPageView: function (pageReference) {
            this.sendEvent('ceros_page_view', pageReference);
        },

        /**
         * Safely add a URL Param to a given URL
         *
         * @param {string} url
         * @param {string} key
         * @param {string} value
         * @return {string}
         */
        setParamInUrl: function (url, key, value) {

            key = encodeURI(key);
            value = encodeURI(value);

            // Split the URL into its path etc and query string
            var urlParts = url.split('?'),
              params = [];

            // If there was a query string
            if (urlParts.length > 1) {
                // turn query string array of params ['key=value', ...]
                params = urlParts[1].split('&');
            }

            // Flag for if the URL already has this param
            var foundKey = false;

            // For every existing param
            for (var i = 0; i < params.length; i++) {

                var paramKeyAndValue = params[i].split('=');

                // If this param is the same as the one we're setting
                if (paramKeyAndValue[0] === key) {

                    foundKey = true;

                    // Update its value and put it back in the array
                    paramKeyAndValue[1] = value;
                    params[i] = paramKeyAndValue.join('=');

                    break;
                }

            }

            // If we didn't find a param with the same name, add ours as a new one
            if (foundKey === false) {
                params.push(key + '=' + value);
            }

            // Build the URL back up and return it
            return urlParts[0] + '?' + params.join('&');
        }

    };

    Abstract.extend = function(implementationPrototype) {

        implementationPrototype = implementationPrototype || {};

        var NewImplementation = function(experience) {
            Abstract.call(this, experience);
        };

        NewImplementation.prototype = Object.create(Abstract.prototype);
        NewImplementation.prototype.constructor = Abstract;

        var methodNames = Object.keys(implementationPrototype);

        for (var i = 0; i < methodNames.length; i++) {

            var methodName = methodNames[i];

            NewImplementation.prototype[methodName] = implementationPrototype[methodName];

        }

        return NewImplementation;
    };

    return Abstract;
});