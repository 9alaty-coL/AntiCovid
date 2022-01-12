function submitPageForm(at, offset = 0) {
    if (at === 0) { 
        $("#page").val($("#page").val() + offset);
    } else {
        $("#page").val(at);
    }
}