(function(root){
    'use strict';

    require([
        './modules/constants',
        './modules/CrossFrameMessenger',
    ], function (constants, CrossFrameMessenger) {

        var clientIdPayload,
          pendingRequestForClientId = [],
          incomingMessenger = new CrossFrameMessenger(constants.NAMESPACE_PREFIX);

        /**
         * Send client id and meta data to given messenger instance
         *
         * @param {CrossFrameMessenger} messenger
         * @param {Object} payload
         */
        var sendClientId = function (messenger, payload) {
            messenger.send(constants.TYPE_RECEIVE_CLIENT_ID, payload);
        };

        /**
         * Update client id and meta data
         *
         * @param {Boolean} isAvailable
         * @param {String=null} newValue
         */
        var updateClientIdAvailabilityAndValue = function (isAvailable, newValue) {

            newValue = newValue || null;

            clientIdPayload = {
                clientId: newValue,
                isAvailable: isAvailable
            };

            // If we have messengers waiting for this new value
            if (pendingRequestForClientId.length > 0) {
                for (var i = 0; i < pendingRequestForClientId.length; i++) {

                    var outgoingMessenger = pendingRequestForClientId.shift();

                    sendClientId(outgoingMessenger, clientIdPayload);
                }
            }
        };

        incomingMessenger.receive(constants.TYPE_EXTENSION_INITIALIZED, function (message, outgoingMessenger) {

            if (typeof clientIdPayload === 'undefined') {
                pendingRequestForClientId.push(outgoingMessenger);
            } else {
                sendClientId(outgoingMessenger, clientIdPayload);
            }

        });

        if (typeof ga === 'function') {
            ga(function(tracker) {

                var clientIdValue = tracker.get('clientId');

                updateClientIdAvailabilityAndValue(true, clientIdValue);
            });
        } else {

            // root.ga = root.ga || [];
            //
            // root.ga.push(function(tracker) {
            //
            //     console.log("GA RAN!");
            //
            //     var clientIdValue = tracker.get('clientId');
            //
            //     updateClientIdAvailabilityAndValue(true, clientIdValue);
            // });

            updateClientIdAvailabilityAndValue(false);
        }

    });
})(window);