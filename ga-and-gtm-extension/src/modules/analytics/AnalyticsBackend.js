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

                if (typeof this.performInit === 'function') {
                    this.performInit();    
                }
                
                this.initalized = true;
            }

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
         * @param {String} eventAction
         * @param {String} eventLabel
         * @param {String=} eventCategory
         */
        sendEvent: function (eventAction, eventLabel, eventCategory) {

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
            this.sendEvent(
                this.config.clickEventAction, 
                hotSpotPayLoad,
                this.config.eventCategory
            );
        },

        /**
         * Record Hover for given Hot Spot Payload
         *
         * @param {String} hotSpotPayLoad
         */
        recordHover: function (hotSpotPayLoad) {
            this.sendEvent(
                this.config.hoverEventAction, 
                hotSpotPayLoad,
                this.config.eventCategory
            );
        },

        /**
         * Record Page View for given Page Payload
         *
         * @param {String} pageReference
         */
        recordPageView: function (pageReference) {

            if (typeof this.decoratePageReference === 'function') {
                pageReference = this.decoratePageReference(pageReference); 
            }

            this.sendEvent(
                this.config.viewEventAction, 
                pageReference,
                this.config.eventCategory
            );
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