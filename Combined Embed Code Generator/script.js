(function($){
    $.ajaxSetup({cache: false});

    $(function(){

        var $touchDevices = $("#touchDevices"),
            $largeEmbed = $("#lg-embed"),
            $smallEmbed = $("#sm-embed"),
            $combinedEmbed = $("#cb-embed"),
            $combinedPanel = $("#cb-embed-panel"),
            $breakPoint = $("#breakPoint"),
            $breakPointContainer = $breakPoint.parent(),
            removeDesktopHeightOverride = $("#desktop-height-override")[0].checked,
            removeMobileHeightOverride = $("#mobile-height-override")[0].checked;



        var parseCerosEmbed = function(tag) {
            var $container = $(tag),
                result = {valid: false};

            if ($container) {
                var iframe = $container.find(':first-child');

                if (iframe) {

                    if (
                        $(iframe).attr("src") !== undefined &&
                        $container.attr("id") !== undefined &&
                        $container.css("padding-bottom") !== undefined
                    ) {

                        result.valid = true;

                        result.id = $container.attr("id");
                        result.padding = $container.css("padding-bottom");
                        result.src = $(iframe).attr("src");

                    }

                }
            }


            return result;
        };

        $touchDevices.change(function() {
            if (this.checked) {
                $breakPoint.prop("disabled", true);
            } else {
                $breakPoint.prop("disabled", false);
            }
        });


        $breakPoint.on("blur", function(event) {
            var newValue = event.value;

            var asInt = parseInt(newValue);

            console.log(event, asInt);

            if (asInt) {
                $breakPointContainer.removeClass("has-error");
            } else {
                $breakPointContainer.addClass("has-error");

            }
        });

        $("#generate").click(function(event){

            var largeData =  parseCerosEmbed($largeEmbed.val()),
                smallData =  parseCerosEmbed($smallEmbed.val());

            if (largeData.valid == true && smallData.valid == true) {

                var combinedData = {
                    defaultPadding: largeData.padding,
                    breakPoint: undefined,

                    largeId: largeData.id,
                    largeSrc: largeData.src,
                    largePadding: largeData.padding,

                    smallId: smallData.id,
                    smallSrc: smallData.src,
                    smallPadding: smallData.padding
                };


                if ( removeDesktopHeightOverride == true )
                {
                  combinedData.largeSrc = combinedData.largeSrc.replace(/\?heightOverride=(\d)+/, "");
                }

                if ( removeMobileHeightOverride == true )
                {
                  combinedData.smallSrc = combinedData.smallSrc.replace(/\?heightOverride=(\d)+/, "");
                }

                var parsedBreakPoint = parseInt($breakPoint.val());

                if (parsedBreakPoint) {
                    combinedData.breakPoint = parsedBreakPoint;
                } else {
                    $breakPointContainer.addClass("has-error");

                    return;
                }

                if ($touchDevices.prop("checked")) {
                    combinedData.breakPoint = 'touch';
                }

                $.get('template.mst', function(template) {

                    var rendered = Mustache.render(template, combinedData);

                    $combinedEmbed.text(rendered);

                    $('.prettyprinted').removeClass('prettyprinted');
                    prettyPrint();

                    $combinedPanel.css("display", "block");
                });

            }

            event.preventDefault();
            return false;
        });

    });
})(jQuery);
