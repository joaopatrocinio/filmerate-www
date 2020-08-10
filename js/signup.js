
(function ($) {
    "use strict";


    /*==================================================================
    [ Validate ]*/
    var input = $('.validate-input .input100');

    $('.validate-form').on('submit',function(e){
        var check = true;

        for(var i=0; i<input.length; i++) {
            if(validate(input[i]) == false){
                showValidate(input[i]);
                check=false;
            }

            /*if ($('.user_sexo').prop('checked') == false) {
                check = false;
                $("#user_sexo_id_error").show();
            } else {
                $("#user_sexo_id_error").hide();
            }*/
        }

        if (!check) {
            e.preventDefault();
        } else {
            e.preventDefault();
            $.ajax({
                url: url_api + 'auth/register',
                type: 'POST',
                data: {
                    user_email: $("#user_email").val(),
                    user_password: $("#user_password").val(),
                    user_firstname: $("#user_firstname").val(),
                    user_lastname: $("#user_lastname").val(),
                    user_data_nascimento: moment($("#user_data_nascimento").val()).format('YYYY-MM-DD'),
                    user_sexo_id: $('input[name=user_sexo_id]:checked').val()
                  }
            })
            .always(function( data, status ) {
                if (status == "success") {
                    Cookies.set('signup', 'true');
                    window.location = "login.html";
                } else {
                    alert("signup error");
                }
            });
        }
    });


    $('.validate-form .input100').each(function(){
        $(this).focus(function(){
           hideValidate(this);
        });
    });

    function validate (input) {
        if($(input).attr('type') == 'email' || $(input).attr('name') == 'email') {
            if($(input).val().trim().match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) == null) {
                return false;
            }
        }
        else {
            if($(input).val().trim() == ''){
                return false;
            }
        }
    }

    function showValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).addClass('alert-validate');
    }

    function hideValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).removeClass('alert-validate');
    }
    
    

})(jQuery);