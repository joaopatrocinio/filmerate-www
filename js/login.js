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

var input = document.querySelector('.validate-input .input100');

Cookies.remove('x-access-token');
Cookies.remove('admin');
Cookies.remove('user_fullname');
Cookies.remove('user_id');

if (Cookies.get('signup') == 'true') {
    document.getElementById('signup-alert').style.display =  'block';
}

[].forEach.call(document.querySelectorAll('.validate-form'), function(el) {
    el.addEventListener('submit', function(e) {
        var check = true;

        for(var i=0; i<input.length; i++) {
            if(validate(input[i]) == false){
                showValidate(input[i]);
                check=false;
            }
        }

        if (!check) {
            e.preventDefault();
        } else {
            e.preventDefault();

            $.ajax({
                url: url_api + 'auth/login',
                type: 'POST',
                data: {
                    user_email: $("#user_email").val(),
                    user_password: $("#user_password").val()
                  }
            })
            .always(function( data, status ) {
                if (status == "success") {
                    if (data.token) {
                        Cookies.set('x-access-token', data.token, { expires: 7 });
                        Cookies.set('signup', 'false');
                        window.location = "./";
                    }
                } else {
                    $("#login-error-alert").css('display', 'block');
                }
            });
        }
    })
})