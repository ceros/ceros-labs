define(function () {

    /**
     * A class to handle two way communication between windows
     *
     * @param {String} nameSpaceSuffix
     * @param {WindowProxy=} targetFrame
     * @param {Boolean=false} listenForIncoming
     *
     * @class CrossFrameMessenger
     */
    var CrossFrameMessenger = function (nameSpaceSuffix, targetFrame, listenForIncoming) {

        this.target = targetFrame || null;
        this.nameSpace =  'com.ceros-labs.' + nameSpaceSuffix;

        this.callbacks = {};

        if (typeof listenForIncoming === 'undefined' || listenForIncoming !== false) {
            window.addEventListener('message', function(message){

                try {
                    // Check event is well formed
                    if (typeof message.data === 'undefined' || typeof message.source === 'undefined') {
                        console.error('Malformed message: missing data.');

                        return;
                    }

                    var parsed = null;

                    try {
                        parsed = JSON.parse(message.data);    
                    } catch (e) {
                        // console.log(e);
                    }
                    

                    // If message parsed successfully and it has a name space which matches ours
                    if (parsed !== null && parsed.name === this.nameSpace) {

                        // if the message has payload
                        if (parsed.type && parsed.payload) {

                            // if we have a callback for this type
                            if (this.callbacks[parsed.type]) {

                                // Set results to the contents of the payload
                                var results = parsed.payload;

                                // Loop through the callbacks for this type
                                this.callbacks[parsed.type].forEach(function (callback) {

                                    // call callback with results
                                    callback(results);
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
        }
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