if ($('#content').val().length < 20) {
    $('#postButton').addClass('disabled');
    $('#postButton').css('pointer-events','none');
}

$('#content')[0].addEventListener('input', (e) => {
    if ($('#content').val().length >= 20 && validateContent($('#content').val())) {
        $('#postButton').removeClass('disabled');
        $('#postButton').css('pointer-events','auto');
    } else {
        $('#postButton').addClass('disabled');
        $('#postButton').css('pointer-events','none');
    }
});

function validateContent(content) {
    const re = /[^a-zA-Z ]/;
    return !re.test(String(content).toLowerCase());
}
