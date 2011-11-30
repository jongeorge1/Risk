﻿steal('jquery/controller',
    'jquery/view/ejs',
    'jquery/dom/form_params',
    'jquery/controller/view',
    '../models/hcp.js',
    '../lib/WebSQL/db.js')
    .then(function ($) {
        $.Controller('Zoladex.Controllers.HcpEdit', {
        },
    {
        init: function () {
            $.mobile.showPageLoadingMsg();

        },
        submit: function (el, ev) {

            ev.preventDefault();

            //            if ($('#NewHcpForm').valid()) {
            //                steal.dev.log('insert hcp form is valid, attempting to save to database...');
            //                new Zoladex.Models.Hcp(el.formParams()).save(this.callback('onInsertSuccess'), this.callback('onInsertFail'));
            //            }

            return false;
        },
        loadData: function () {
            var params = this.getQueryStringParams();

            var deffered = Zoladex.Models.Hcp.findOne(params.Id);

            deffered.done(this.callback('insertData'));
        },
        getQueryStringParams: function () {

            var queryString = window.location.href.split('?')[1];

            return $.String.deparam(queryString);
        },

        insertData: function (data) {

            var view = $.View('//zoladex/views/hcp_addedit/init.ejs', data);

            var form = $('#EditHcpForm');

            form.html(view);

            form.trigger('create');

            $.mobile.hidePageLoadingMsg();
        }
    });
    });