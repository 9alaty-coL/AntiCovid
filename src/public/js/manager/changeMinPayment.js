$('.change-min-payment').submit(function(e) {
    e.preventDefault();
    
    // $(this).serialize(); will be the serialized form
    let data = $(this).serialize();
    let key = data.split('&');
    let couple = {};
    couple.P_ID = key[0].split('=')[1];
    couple.P_MinPayment = key[1].split('=')[1];
    
    $(`#${couple.P_ID}`).text(`${couple.P_MinPayment}`);

    // Submit
    $.ajax({
        url: '/manager/putChangeMinPayment',
        type: 'PUT',
        data: data,
    });
});