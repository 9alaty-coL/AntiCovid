function resetStatus() {
    console.log($('#LeftStatus').text());
    $('#LeftStatus').text($('#LeftStatus').text().slice(0, 2));

    $('.status').each(function() {
        $(this).text($(this).text().slice(0, 2));
    });
}

function calStatus(Status, offset) {
    let nextStatus = parseInt(Status[1]) + offset;
    if (nextStatus < 0) return "F0";
    else if (nextStatus > 3) return "Xóa";
    else return "F" + nextStatus;
}

function changeStatusRelate(to) {
    if ($('#LeftStatus').text().length > 2) resetStatus();
    let Status = $('#LeftStatus').text(); // F?
    let offset = to - parseInt(Status[1]);

    if (offset === 0) return;

    $('#LeftStatus').html(`${Status}<b class="text-danger"> → F${to}</b>`);

    $('.status').each(function(index) {
        if (index === 0) return;
        let curStatus = $(this).text();
        $(this).html(`${curStatus}<b class="text-danger border-end-0"> → ${calStatus(curStatus, offset)}</b>`)
    });
}

// Check Status Option
$(document).ready(function(){
    let StatusOption = $("#Current").val();
    $(".StaOp").each(function() {
        if ($(this).text() === StatusOption) {
            $(this).attr('selected', 'selected');
            $(this).attr('disabled', 'disabled');
        }
    })
});


