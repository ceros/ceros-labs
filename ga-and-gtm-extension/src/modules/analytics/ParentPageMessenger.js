define([
    './AnalyticsBackend',
    '../CrossFrameMessenger',
    '../constants'
], function (AnalyticsBackend, CrossFrameMessenger, constants) {
    /**
     * Analytics Backend to delegate event processing to parent page.
     *
     * @param {Object} config
     *
     * @class ParentPageMessenger
     * @extends AnalyticsBackend
     */
    var ParentPageMessenger = AnalyticsBackend.extend({

        performInit:  function () {

            this.messenger = new CrossFrameMessenger(constants.NAMESPACE_PREFIX, window.parent, false);
        },

        sendEvent: function (eventName, eventLabel, eventCategory) {

            eventCategory = eventCategory || this.config.eventCategory || '';

            var event = {
                eventType: 'event',
                eventCategory: eventCategory,
                eventName: eventName,
                eventLabel: eventLabel
            };

            this.messenger.send(constants.TYPE_DELEGATED_EVENT, event);
        }

    });

    return ParentPageMessenger;
});