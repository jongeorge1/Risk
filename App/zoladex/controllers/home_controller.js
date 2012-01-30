steal('jquery/controller',
    'jquery/view/ejs',
    'jquery/dom/form_params',
    'jquery/controller/view',
    '../models/alert.js',
    '../lib/WebSQL/db.js')
    .then(function ($) {
        $.Controller('Zoladex.Controllers.Home', {
    },
    {
        init: function () {

            $.mobile.showPageLoadingMsg();
            
            var alertsdef = Zoladex.Models.Alert.findAll();

            $.when(alertsdef).done(function (alertres) {

                $.mobile.hidePageLoadingMsg();
                
                steal.dev.log(alertres);

                if (alertres.length > 0 && alertHasBeenShown == false) {
                    $.mobile.changePage("../home/dialog/alertdialog.htm");
                }
            });

        }
    });
});