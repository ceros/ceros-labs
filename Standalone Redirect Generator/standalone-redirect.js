(function() {
    'use strict';

    var scriptTag = document.getElementById("ceros-variant-redirect"),
        scriptSrc = scriptTag.getAttribute("src"),
        scriptDirectory = "./";

    if (scriptSrc) {
        var path = scriptSrc.split('?')[0];

        scriptDirectory = path.split('/').slice(0, -1).join('/') +'/';
    }

    require.config({
        paths: {
            modules:  scriptDirectory + "modules"
        }
    });

    require([
        'modules/Options',
        'modules/Logger',
        'modules/Url',
        'modules/UrlUtilities',
        'modules/DeviceDetect'
    ], function(Options, Logger, Url, UrlUtilities, DeviceDetect) {

        var opts = Options(scriptTag);

        Logger.setShouldLog(opts.shouldLog);

        Logger.log("Options: ", opts);

        if (opts.type === null || opts.altVariantUrl === null) {
            return console.error("Missing Type and/or Variant URL");
        }

        var currentUrl = new Url(window.location.href),
            variantUrl = new Url(opts.altVariantUrl);

        if (UrlUtilities.isCerosPreview(currentUrl) === false || opts.redirectPreviewLinks === true) {

            var isMobile = DeviceDetect.isMobileDevice(opts);

            Logger.log("Is Mobile Device?: ", isMobile);

            if ((isMobile == true && opts.isDesktop == true) || (isMobile == false && opts.isDesktop == false)) {

                var shouldRedirect = true;

                if (opts.preserveUrlQuery === true) {

                    Logger.log("Preserving URL Query Params");

                    UrlUtilities.mergeQueryParams(currentUrl, variantUrl);
                }

                if (opts.preserveUrlFragment === true) {

                    Logger.log("Preserving URL fragment");

                    UrlUtilities.copyUrlFragment(currentUrl, variantUrl);
                }

                if (opts.preservePageNumber === true) {

                    Logger.log("Preserving Ceros page number");

                    var currentPageNumber = UrlUtilities.getPageNumberFromUrl(currentUrl);

                    UrlUtilities.setPageNumber(variantUrl, currentPageNumber);

                }

                if (opts.forceHttps === true && UrlUtilities.isSecure(variantUrl) === false) {

                    Logger.log("Forcing HTTPS");

                    UrlUtilities.setSecure(variantUrl);
                }

                // Unless specifically told otherwise, check we're not about to redirect back to where we came from
                if (opts.redirectToReferrer === false && document.referrer) {

                    var referrerUrl = new Url(document.referrer);

                    if (UrlUtilities.isEqual(variantUrl, referrerUrl)) {

                        Logger.log("Was refereed from variant URL, redirect aborted.");

                        shouldRedirect = false;
                    }

                }

                if (UrlUtilities.isEqual(currentUrl, variantUrl) === false && shouldRedirect) {

                    Logger.log("Redirecting to: ", variantUrl.toString());

                    UrlUtilities.redirectTo(variantUrl);
                } else {
                    Logger.log("Already on variant URL, no redirect needed");
                }

            } else if (opts.forceHttps === true && UrlUtilities.isSecure(currentUrl) === false) {

                UrlUtilities.setSecure(currentUrl);

                Logger.log("Forcing current URL to use HTTPS");
                Logger.log("Redirecting to: ", currentUrl.toString());

                UrlUtilities.redirectTo(currentUrl);

            }

        } else {
            Logger.log("Not redirecting preview links");
        }
    });

})();