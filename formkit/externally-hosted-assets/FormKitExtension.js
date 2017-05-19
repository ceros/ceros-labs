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

  var nameSpace = "form-kit.labs.ceros.com",
    dataProviders = {},
    eventCallbacks = {};

  window.addEventListener("message", function(message){

    try {
      // Check event is well formed
      if (! message.data) {
        console.error("Malformed message: missing data.");

        return;
      }

      var parsed = JSON.parse(message.data);

      // If message parse successfully and it has a name which matches ours
      if (parsed && parsed.name == nameSpace) {
        // if the message has payload
        if (parsed.id && parsed.type && parsed.payload) {

          var timestamp = new Date().getUTCMilliseconds();

          var response = {
            id: timestamp,
            responseTo: parsed.id,
            name: nameSpace,
            type: parsed.type,
            payload: {}
          };

          if (parsed.type === 'request-data') {

            for (var providerName in parsed.payload) {

              if (parsed.payload.hasOwnProperty(providerName)) {

                if (typeof dataProviders[providerName] !== 'undefined') {
                  response.payload[providerName] = {};

                  parsed.payload[providerName].forEach(function (dataKey) {
                    response.payload[providerName][dataKey] = dataProviders[providerName].getValueForKey(dataKey);
                  });

                } else {
                  response.error = "Unknown data provider";

                  break;
                }

              }
            }
          } else if (parsed.type === 'broadcast-event') {
            if (parsed.payload.name && parsed.payload.data) {

              if (typeof eventCallbacks[parsed.payload.name] !== 'undefined') {

                eventCallbacks[parsed.payload.name].forEach(function(callback) {
                  setTimeout(function() {
                    callback(parsed.payload.data);
                  }, 0);
                });
              }

            }

          }

          var messageText = JSON.stringify(response);

          message.source.postMessage(messageText, "*");

        }
      }
    } catch (e) {
      // Log errors
      console.error(e);
    }
  });

  var FormKitExtension = {
    registerDataProvider: function (name, instance) {
      if (typeof dataProviders[name] === "undefined" && typeof instance['getValueForKey'] === 'function') {
        dataProviders[name] = instance;
      } else {
        throw new Error("Invalid Data Provider");
      }
    },

    subscribe: function (eventName, callback) {

      if (typeof eventCallbacks[eventName] === 'undefined') {
        eventCallbacks[eventName] = [];
      }

      eventCallbacks[eventName].push(callback);
    }
  };


  /**
   * Parse a URL and return its Query Parameters.
   *
   * @param {String} url
   * @param {Object} [defaultParamsObj={}]
   * @returns Object
   */
  var getParametersFromURL = function(url, defaultParamsObj) {

    defaultParamsObj = defaultParamsObj || {};

    if (url.indexOf('?') > -1) {

      var params = url.substring(url.indexOf('?') + 1).split('&');

      for (var i = 0; i < params.length; i++) {

        var paramParts = params[i].split('=');

        var paramName = decodeURIComponent(paramParts[0]),
          paramValue = decodeURIComponent(paramParts[1]);

        defaultParamsObj[paramName] = paramValue;
      }
    }

    return defaultParamsObj;
  };

  var urlParams = getParametersFromURL(window.location.href || ''),
    referrerParams = getParametersFromURL(document.referrer || '');

  FormKitExtension.registerDataProvider('CerosUrl', {
    getValueForKey: function (key) {
      return urlParams[key];
    }
  });

  FormKitExtension.registerDataProvider('ReferrerUrl', {
    getValueForKey: function (key) {
      return referrerParams[key];
    }
  });

  return exports.FormKitExtension = FormKitExtension;
}));