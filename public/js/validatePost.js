if ($('#content').val().length < 20) {
    $('#postButton').addClass('disabled');
    $('#postButton').css('pointer-events','none');
}

$('#content')[0].addEventListener('input', (e) => {
    if ($('#content').val().length >= 20) {
        $('#postButton').removeClass('disabled');
        $('#postButton').css('pointer-events','auto');
    } else {
        $('#postButton').addClass('disabled');
        $('#postButton').css('pointer-events','none');
    }
});