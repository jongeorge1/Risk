﻿steal('jquery/controller',
    'jquery/view/ejs',
    'jquery/dom/form_params',
    'jquery/controller/view'
    )
    .then(function ($) {
        $.Controller('Zoladex.Controllers.ProList', {
            init: function () {
                alert('todo: load pro data from local db');
            }
        });
    });