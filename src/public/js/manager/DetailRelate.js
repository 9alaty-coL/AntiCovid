function resetStatus() {
    console.log($('#LeftStatus').text());
    $('#LeftStatus').text($('#LeftStatus').text().split(" ")[0]);

    $('.status').each(function() {
        $(this).text($(this).text().split(" ")[0]);
    });
}

function calStatus(Status, offset) {
    if (Status === "Không") Status = "F4";
    let nextStatus = parseInt(Status[1]) + offset;
    if (nextStatus < 0) return "F0";
    else if (nextStatus > 3) return "Không";
    else return "F" + nextStatus;
}

function changeStatusRelate(to) {
    if ($('#LeftStatus').text().length > 2) resetStatus();
    let Status = $('#LeftStatus').text();
    
    let from;
    if (Status === "Không") from = 4; else from = Status[1];
    let offset = to - from;

    if (offset === 0) return;

    $('#LeftStatus').html(`${Status}<b class="text-danger"> → ${calStatus(Status, offset)}</b>`);

    $('.status').each(function(index) {
        let curStatus = $(this).text();
        $(this).html(`${curStatus}<b class="text-danger border-end-0"> → ${calStatus(curStatus, offset)}</b>`)
    });
}

// Check Status Option
$(document).ready(function(){
    let StatusOption = $("#from").val();
    $(".StaOp").each(function() {
        if ($(this).text() === StatusOption) {
            $(this).attr('selected', 'selected');
            $(this).attr('disabled', 'disabled');
        }
    })
});


