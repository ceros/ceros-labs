(function($){
    $.ajaxSetup({cache: false});

    $(function(){

      //  var $touchDevices = $("#touchDevices"),
        var $largeEmbed = $("#lg-embed"),
            $mediumEmbed = $("#md-embed"),
            $smallEmbed = $("#sm-embed"),
            $combinedEmbed = $("#cb-embed"),
            $combinedPanel = $("#cb-embed-panel"),
            $mediumBreakPoint = $("#mediumBreakPoint"),
            $smallBreakPoint = $("#smallBreakPoint"),
            $mediumBreakPointContainer = $mediumBreakPoint.parent(),
            $smallBreakPointContainer = $smallBreakPoint.parent();


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

        /*

        $touchDevices.change(function() {
            if (this.checked) {
                $breakPoint.prop("disabled", true);
            } else {
                $breakPoint.prop("disabled", false);
            }
        });

        */


        $mediumBreakPoint.on("blur", function(event) {
            var newValue = event.value;

            var asInt = parseInt(newValue);

            console.log(event, asInt);

            if (asInt) {
                $mediumBreakPointContainer.removeClass("has-error");
            } else {
                $mediumBreakPointContainer.addClass("has-error");

            }
        });


        $smallBreakPoint.on("blur", function(event) {
            var newValue = event.value;

            var asInt = parseInt(newValue);

            console.log(event, asInt);

            if (asInt) {
                $smallBreakPointContainer.removeClass("has-error");
            } else {
                $msmallBreakPointContainer.addClass("has-error");

            }
        });



        $("#generate").click(function(event){

            var largeData  =  parseCerosEmbed($largeEmbed.val()),
                mediumData =  parseCerosEmbed($mediumEmbed.val()),
                smallData  =  parseCerosEmbed($smallEmbed.val());

            if (largeData.valid == true && mediumData.valid == true && smallData.valid == true) {

                var combinedData = {
                    defaultPadding: largeData.padding,
                    mediumBreakPoint: undefined,
                    smallBreakPoint: undefined,

                    largeId: largeData.id,
                    largeSrc: largeData.src,
                    largePadding: largeData.padding,

                    mediumId: mediumData.id,
                    mediumSrc: mediumData.src,
                    mediumPadding: mediumData.padding,

                    smallId: smallData.id,
                    smallSrc: smallData.src,
                    smallPadding: smallData.padding
                };

                var parsedMediumBreakPoint = parseInt($mediumBreakPoint.val()),
                    parsedSmallBreakPoint = parseInt($smallBreakPoint.val());

                if (parsedMediumBreakPoint) {
                    combinedData.mediumBreakPoint = parsedMediumBreakPoint;
                } else {
                    $mediumBreakPointContainer.addClass("has-error");

                    return;
                }

                if (parsedSmallBreakPoint) {
                    combinedData.smallBreakPoint = parsedSmallBreakPoint;
                } else {
                    $smallBreakPointContainer.addClass("has-error");

                    return;
                }

                /*
                if ($touchDevices.prop("checked")) {
                    combinedData.breakPoint = 'touch';
                }
                */

                $.get('triple-template.mst', function(template) {

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
