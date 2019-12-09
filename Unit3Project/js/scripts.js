$(document).ready(function(){
    $('.subTypeSelect').css({
        minWidth: $('#typeSelect').width()
    });

    
    $('#dismissDetailBtn').on('click', function(){
        $('#overlay').css("display", "block");
    });
});