define(function () {

    var shouldLog = true;

    return {
        setShouldLog: function(value) {
            shouldLog = value;
        },

        log: function() {

            if (shouldLog === false) {
                return;
            }

            return window.console && console.log && Function.apply.call(console.log, console, arguments);
        }
    };
});