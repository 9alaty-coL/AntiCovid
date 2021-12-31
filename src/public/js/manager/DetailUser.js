$("#ChangeStatusForm").submit(function() {
    if ($("#from").val() === $("#to :selected").val()) {
        alert("Trạng thái sau khi chuyển bằng trạng thái ban đầu");
        return false;
    }
})