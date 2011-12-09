steal('jquery/controller',
    'jquery/view/ejs',
    'jquery/lang/string/deparam/deparam.js',
    'jquery/dom/form_params',
    'jquery/controller/view',
    '../models/hcp.js',
    '../models/practice.js',
    '../lib/WebSQL/db.js',
    '../views/hcp_details/init.ejs')
    .then(function ($) {
        $.Controller('Zoladex.Controllers.HcpDetails', {
    },
    {
        init: function () {

            $.mobile.showPageLoadingMsg();
        },

        loadData: function () {

            //get query string params
            var params = Zoladex.QSUtils.getParams();

            var practiceName = null;
            var practiceres = null;
            var hcpres = null;
            var hcpdef = Zoladex.Models.Hcp.findOne(params.id);

            $.when(hcpdef).done(function (hcpres) {

                var practicedef = Zoladex.Models.Practice.findOne(hcpres.PracticeName);
                $.when(practicedef).done(function (practiceres) {
                    $('#HcpDetailsPage h1').html(hcpres.FullName());

                    var editLink = $('#EditHcpButton').attr('href') + hcpres.id;

                    $('#EditHcpButton').attr('href', editLink);

                    var view = $.View('//zoladex/views/hcp_details/init.ejs', {
                        id: hcpres.id,
                        Title: hcpres.Title,
                        FirstName: hcpres.FirstName,
                        Surname: hcpres.Surname,
                        PracticeName: practiceres.Name,
                        Telephone: hcpres.Telephone,
                        Email: hcpres.Email,
                        Street: hcpres.Street,
                        Town: hcpres.Town,
                        County: hcpres.County,
                        Postcode: hcpres.Postcode
                    });

                    //$('#HcpDetailsList', this.element).append(view);

                    $('#HcpDetailsList').html(view).trigger('create');

                    $('#HcpDetailsList').listview('refresh');

                    $('#DeleteHcpButton').attr("href", "dialog/hcpconfirmdialog.htm?id=" + params.id);

                    $.mobile.hidePageLoadingMsg();
                });
            });

        }
    });
});