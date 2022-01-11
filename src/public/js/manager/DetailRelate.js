function cancelChange() {
    $("#Null").prop('selected', true);
    resetStatus();
}

function resetStatus() {
    $("#submitBtn").attr("disabled", true);

    $('#LeftStatus').text($('#LeftStatus').text().split(" → ")[0]);

    $('.status').each(function() {
        $(this).text($(this).text().split(" → ")[0]);
    });
}

function calOffset(Status, to) {
    if (Status.length !== 2)  return 0;
    return parseInt(Status[1]) - parseInt(to[1]);
}

function calStatus(Status, offset) {
    if (offset < 0) {
        if (Status === "F0") return "Khỏi bệnh"
        else return "Không"
    }
    else {
        let nextF = Math.max(0, parseInt(Status[1]) - offset);
        return Status[0] + nextF;
    }
}

$('#to').change(function(){
    changeStatusRelate($(this).val());
    $("#submitBtn").removeAttr("disabled");
});

function changeStatusRelate(to) {
    resetStatus();
    let Status = $('#LeftStatus').text();
    let Offset = calOffset(Status, to);

    let textColor = "text-danger";
    if($('#LeftStatus').text().includes("F0"))
        textColor = "text-success";
    
    if ($('#LeftStatus').text().includes("F0")) {
        $('#LeftStatus').html(`${Status}<b class="${textColor}"> → ${calStatus(Status, Offset)}</b>`);
        let isReturn = false;
        $('.status').each(function(index) {
            if ($(this).text().includes("F0")) isReturn = true;
        })
        if (isReturn) return;          
    } else {
        $('#LeftStatus').html(`${Status}<b class="${textColor}"> → ${calStatus(Status, Offset)}</b>`);
    }

    $('.status').each(function(index) {
        if ($(this).text() === "Khỏi bệnh" || $(this).text() === "F0") return;

        let curStatus = $(this).text();
        if ($(this).text() === "Không") {
            $(this).html(`${curStatus}<b class="${textColor} border-end-0"> → ${calStatus("F4", Offset)}</b>`)   
        } else {
            $(this).html(`${curStatus}<b class="${textColor} border-end-0"> → ${calStatus(curStatus, Offset)}</b>`)            
        }
    });
}


