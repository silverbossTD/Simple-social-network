function isEmpty(id) {
    if ($(`#${id}`).val().length < 5) {
        $('#loginButton').addClass('disabled');
        $('#loginButton').css('pointer-events','none');
    }
    $(`#${id}`)[0].addEventListener('input', (e) => {
        if ($(`#${id}`).val().length >= 5) {
            $(`#${id}`).css('border', '1px solid green');
            validate();
        } else {
            $('#loginButton').addClass('disabled');
            $(`#${id}`).css('border', '1px solid red');
            $('#loginButton').css('pointer-events','none');
        }
    });
}

function validateEmail(email) {
    let emails = ['@gmail.com', '@yahoo.com', '@789.vn', '@icloud.com', '@hotmail.co'];
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    for (let i in emails) {
        if(email.indexOf(emails[i]) !== -1) {
            return re.test(String(email).toLowerCase());
        }
    }
}

function validateName(name) {
    const re = /[^a-zA-Z ]/;
    return !re.test(String(name).toLowerCase());
}

function validate() {
    if (
        $('#username').val().length >= 5                    &&
        $('#email').val().length >= 5                       &&
        $('#password').val().length >= 5                    &&
        $('#passwordConf').val().length >= 5                &&
        $('#passwordConf').val() === $('#password').val()   &&
        validateEmail($(`#email`).val())                    &&
        validateName($(`#username`).val())
    ) {
        $('#loginButton').removeClass('disabled');
        $('#loginButton').css('pointer-events','none');
    } else $('#loginButton').addClass('disabled');
}

isEmpty('username');
isEmpty('email');
isEmpty('password');
isEmpty('passwordConf');
