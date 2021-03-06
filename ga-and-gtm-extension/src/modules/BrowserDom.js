define(function () {

    /**
     * Class to Abstract the Browser's DOM from Ceros
     *
     * @param {CerosExperience} experience
     * @constructor
     */
    var BrowserDom = function (experience) {
        this.experience = experience;
        this.allSyncedObjects = null;
    };

    BrowserDom.prototype = {
        /**
         * Find an element on a page or in smart group based on its
         * Component ID
         *
         * @param {String} componentId
         * @return {Element|null}
         */
        getElementByComponentId: function (componentId) {

            var element = this.getElementFromPageByComponentId(componentId);

            // If the element wasn't found on the page, it should be in a smart group
            if (element === null) {

                return this.getElementFromSyncedObjectByComponentId(componentId);

            }

            return element;
        },

        /**
         * Find an element on a page based on its Component ID
         *
         * @param {String} componentId
         * @return {Element|null}
         */
        getElementFromPageByComponentId: function (componentId) {
            return document.getElementById(componentId);
        },

        /**
         * Find an element in a smart group based on its Component ID
         *
         * @param {String} componentId
         * @return {Element|null}
         */
        getElementFromSyncedObjectByComponentId: function (componentId) {

            var foundDomElement = null;

            if (this.allSyncedObjects === null) {
                this.allSyncedObjects = this.experience.findAllSyncedObjects();
            }

            this.allSyncedObjects.syncedObjects.forEach(function(syncedObject){

                if (foundDomElement === null) {

                    var domElementId = syncedObject.id + "|" + componentId;

                    var domElement = document.getElementById(domElementId);

                    if (domElement !== null) {

                        foundDomElement = domElement;
                    }

                }

            });

            return foundDomElement;
        }
    };

    return BrowserDom;
});