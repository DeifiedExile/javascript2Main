$(document).ready(function(){


    $('.subTypeSelect').css({
        minWidth: $('#typeSelect').width()
    });
    $('#detailBtn').click();
    
    $('#dismissDetailBtn').on('click', function(){
        $('#overlay').css("display", "block");
    });
    $('#overlay').on('click', function(){
        $(this).css("display", "none");
    });




    // $('#tab1').click();
    //
    // $('#closeInfoModal').on('click', function(){
    //     console.log('click');
    //     $('#infoModal').modal('hide');
    // });
});