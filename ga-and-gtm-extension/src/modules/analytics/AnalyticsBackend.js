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

        if (typeof config.addTag !== "undefined") {
            this.shouldAddTag = config.addTag;
        } else {
            this.shouldAddTag = true;
        }
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
         * @param {String=} eventCategory
         */
        sendEvent: function (eventName, eventLabel, eventCategory) {

        },

        /**
         * Template method to allow subclasses to change the way pages are refrenced
         *
         * @param {String} pageReference
         */
        decoratePageReference: function(pageReference) {
            return pageReference;
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
            var decoreatedPageRefrence = this.decoratePageReference(pageReference);

            this.sendEvent('ceros_page_view', decoreatedPageRefrence);
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