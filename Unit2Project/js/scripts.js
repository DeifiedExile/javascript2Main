$(document).ready(function(){

    $('#tab1').click();

    $('#closeInfoModal').on('click', function(){
        console.log('click');
        $('#infoModal').modal('hide');
    });
});