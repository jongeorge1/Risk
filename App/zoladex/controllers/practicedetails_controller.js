steal('jquery/controller',
    'jquery/view/ejs',
    'jquery/lang/string/deparam/deparam.js',
    'jquery/dom/form_params',
    'jquery/controller/view',
    '../models/practice.js',
    '../lib/WebSQL/db.js',
    '../views/practice_details/init.ejs'
    )
    .then(function ($) {
        $.Controller('Zoladex.Controllers.PracticeDetails', {
        },
    {
        init: function () {
            $.mobile.showPageLoadingMsg();
        },

        loadData: function () {

            //get query string params
            var params = Zoladex.QSUtils.getParams();

            var deffered = Zoladex.Models.Practice.findOne(params.id);

            deffered.done(this.callback('insertData'));
        },

        insertData: function (data) {

            $('#PracticeDetailsPage h1').html(data.Name);

            var editLink = $('#EditPracticeButton').attr('href') + data.id;

            $('#EditPracticeButton').attr('href', editLink);

            var view = this.view('//zoladex/views/practice_details/init.ejs', data);

            $('#PracticeDetailsList', this.element).append(view);

            $('#PracticeDetailsList').listview('refresh');

            $('#DeletePracticeButton').attr("href", "dialog/practiceconfirmdialog.htm?id=" + data.id);

            $.mobile.hidePageLoadingMsg();
        }   
    });
    });