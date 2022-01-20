function submitPageForm(at, offset = 0) {
    if (at === 0) { 
        $("#page").val(parseInt($("#page").val()) + offset);
    } else {
        $("#page").val(at);
    }
}