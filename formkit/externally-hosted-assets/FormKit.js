(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['exports'], factory);
  } else if (typeof exports === 'object' && typeof exports.nodeName !== 'string') {
    // CommonJS
    factory(exports);
  } else {
    // Browser globals
    factory(root);
  }
}(this, function(exports) {
  'use strict';

  var Promise = function(context) {
    var callbacks = [];

    /**
     * Resolve or Reject the promise
     *
     * @param {string} type
     * @param {object} context
     * @param {*} args
     */
    var execute = function(type, context, args) {
      var hasCallback = callbacks.length;

      // If this instance has no callbacks to triger 
      if (!hasCallback) {
        return;
      }

      // Fire callbacks for the resolution type (resolve or reject) 
      callbacks[0][type].apply(context, args);
      callbacks.shift();
    };

    return {
      context: context || {},

      resolve: function() {
        execute('fulfilled', this.context, arguments);
      },

      reject: function() {
        execute('rejected', this.context, arguments);
      },

      then: function(onFulfilled, onRejected) {
        callbacks.push({ 'fulfilled': onFulfilled, 'rejected': onRejected });
        return this;
      }
    };
  };


  var target = window.parent,
    nameSpace = "form-kit.labs.ceros.com",
    deferreds = {};

  /**
   * Send a message to Ceros in parent frame
   *
   * @param {string} messageType
   * @param {object} payload
   * @returns {Promise}
   */
  var send = function(messageType, payload) {

    var timestamp = new Date().getUTCMilliseconds();

    var message = {
      id: timestamp,
      name: nameSpace,
      type: messageType,
      payload: payload
    };

    var messageText = JSON.stringify(message);

    target.postMessage(messageText, "*");

    var deferred = new Promise();

    deferreds[messageType + ':' + timestamp] = deferred;

    return deferred;
  };

  /**
   * Receive message that is potentially from Ceros in parent frame
   */
  window.addEventListener("message", function (message) {

    try {
      // Check event is well formed
      if (! message.data) {
        console.error("Malformed message: missing data.");

        return;
      }

      var parsed = JSON.parse(message.data);

      // If message parse successfully and it has a name which matches ours
      if (parsed && parsed.name && parsed.name == nameSpace) {

        // if the message has payload
        if (parsed.responseTo && parsed.type && parsed.payload) {

          var deferredId = parsed.type + ':' + parsed.responseTo;

          if (deferreds[deferredId] && deferreds[deferredId] !== null) {

            // Set results to the contents of the payload
            var results = parsed.payload,
              error = parsed.error || false;

            if (error) {
              deferreds[deferredId].reject(error);
            } else {
              deferreds[deferredId].resolve(results);
            }

            setTimeout(function () {
              deferreds[deferredId] = null;
            }, 0);
          }

        }
      }
    } catch (e) {
      // Log errors
      console.error(e);
    }
  });

  exports.FormKit = {
    fetchDataFormCeros: function (spec) {
      return send('request-data', spec);
    },

    broadcastEventToCeros: function (eventName, eventData) {
      eventData = eventData || {};

      return send('broadcast-event', {
        name: eventName,
        data: eventData
      });
    }
  };

  return exports.FormKit;
}));