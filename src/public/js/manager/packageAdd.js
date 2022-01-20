$('#P_Quantity').click(function(){
    let number = $(this).val();
    $('.products').empty();
    for(let i = 0; i < parseInt(number); i++) {
        let htmlStr= `
        <div class="d-flex my-3">
            <select type="text" class="form-select d-inline-block me-3" name="P_ProductsID"  style="padding:.6rem; font-size:1.3rem; flex:3;">
        `;

        for(let j = 0; j < listProducts.length; j++) {
            htmlStr += `
                <option value="${listProducts[j].Product_ID}">${listProducts[j].Product_Name}</option>
            `
        }
        htmlStr += `
                </select>
                <input type="number" min="1" class="form-control d-inline-block" name="P_ProductsLimit" placeholder="Số sản phẩm tối đa" onkeydown="return false" style="padding:.6rem; font-size:1.4rem; flex:1;">
            </div>
        `
        $('.products').append(htmlStr);
    }
})