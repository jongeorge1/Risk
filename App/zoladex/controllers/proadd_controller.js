steal('jquery/controller',
    'jquery/view/ejs',
    'jquery/dom/form_params',
    'jquery/controller/view',
    '../models/professional.js',
    '../lib/WebSQL/db.js')
    .then(function ($) {
        $.Controller('Zoladex.Controllers.ProAdd', {
        },
    {
        init: function () {

        },
        submit: function (el, ev) {

            ev.preventDefault();

            if ($('#NewHcpForm').valid()) {
                new Zoladex.Models.Professional(el.formParams()).save(this.callback('onInsertSuccess'));
            }

            return false;
        },
        onInsertSuccess: function () {
            $.mobile.changePage('dialog/success.htm', 'pop', false, true);
        },
        onInsertFail: function () {
            steal.dev.log('professional has not been added');
            $.mobile.changePage('dialog/error.htm', 'pop', false, true);
        }

    });
    });