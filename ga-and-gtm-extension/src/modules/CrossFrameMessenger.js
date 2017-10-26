define(function () {

    /**
     * A class to handle two way communication between windows
     *
     * @param {String} nameSpaceSuffix
     * @param {WindowProxy=} targetFrame
     *
     * @class CrossFrameMessenger
     */
    var CrossFrameMessenger = function (nameSpaceSuffix, targetFrame) {

        this.target = targetFrame || null;
        this.nameSpace =  'com.ceros-labs.' + nameSpaceSuffix;

        this.callbacks = {};

        window.addEventListener("message", function(message){

            try {
                // Check event is well formed
                if (typeof message.data === 'undefined' || typeof message.source === 'undefined') {
                    console.error('Malformed message: missing data.');

                    return;
                }

                var parsed = JSON.parse(message.data);

                // If message parsed successfully and it has a name space which matches ours
                if (parsed && parsed.name === this.nameSpace) {

                    var returnObject = new CrossFrameMessenger(nameSpaceSuffix, message.source);

                    // if the message has payload
                    if (parsed.type && parsed.payload) {

                        // if we have a callback for this type
                        if (this.callbacks[parsed.type]) {

                            // Set results to the contents of the payload
                            var results = parsed.payload;

                            // Loop through the callbacks for this type
                            this.callbacks[parsed.type].forEach(function (callback) {

                                // call callback with results and source's CrossFrameMessenger
                                callback(results, returnObject);
                            });

                        }

                    } else {

                        throw new Error('Malformed message');

                    }
                }
            } catch (e) {
                console.error(e);
            }
        }.bind(this));
    };


    CrossFrameMessenger.prototype = {

        /**
         * Send a message to the objects target frame
         *
         * @param {String} messageType
         * @param {Object=} messagePayload
         */
        send: function(messageType, messagePayload) {

            if (this.target !== null) {

                messagePayload = messagePayload || {};

                var message = {
                    name: this.nameSpace,
                    type: messageType,
                    payload: messagePayload
                };

                var messageText = JSON.stringify(message);

                this.target.postMessage(messageText, '*');
            }
        },

        /**
         * Register callback to be executed on receipt of a message
         *
         * @param {String} messageType
         * @param {Function} callback
         */
        receive: function(messageType, callback) {

            // Check to see if we have an array of callbacks for this message type
            if (! this.callbacks[messageType]) {
                this.callbacks[messageType] = [];
            }

            this.callbacks[messageType].push(callback);
        }
    };

    return CrossFrameMessenger;
});