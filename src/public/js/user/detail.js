let currProducts = [];

for (var i = 0; i < currPackage.P_ProductsID.length; i++) {
    currProducts.push(products[currPackage.P_ProductsID[i]-1]);
}

showBill();
$('input').click(function() {
    $('.bill').empty();
    $('.bill').append(`Đơn hàng:`);
    let quantity = [];
    let totalPrice = 0;
    for (var i = 0; i < currProducts.length; i++) {
        var n = $(`.input${currProducts[i].Product_ID}`).val();
        quantity.push(n);
        let price = quantity[i] * currProducts[i].Product_Price;
        totalPrice += price;
        $('.bill').append(`
            <li class="product">
                <div class="row">
                    <div class="col-6 product-desc ">
                    ${currProducts[i].Product_Name} : ${quantity[i]} ${currProducts[i].Product_Unit}
                    </div>
                    <div class="col-6 product-quantity ">
                        ${currProducts[i].Product_Price}đ x  ${quantity[i]} = <span class="text-orange"> ${price}đ</span>
                    </div>
                </div>
            </li>
        `);
    }
    $('.bill').append(`
            <li class="product">
                <div class="row">
                    <div class="col-6 product-desc ">
                        -> Tổng cộng: 
                    </div>
                    <div class="col-6 product-quantity">
                        <input class="text-orange mx-4" readonly name="totalPrice" value="${totalPrice}">đ
                    </div>
                </div>
            </li>
        `);
});


function showBill() {
    $('.bill').empty();
    $('.bill').append(`Đơn hàng:`);
    let quantity = [];
    let totalPrice = 0;
    for (var i = 0; i < currProducts.length; i++) {
        var n = $(`.input${currProducts[i].Product_ID}`).val();
        quantity.push(n);
        let price = quantity[i] * currProducts[i].Product_Price;
        totalPrice += price;
        $('.bill').append(`
            <li class="product">
                <div class="row">
                    <div class="col-6 product-desc ">
                    ${currProducts[i].Product_Name} : ${quantity[i]} ${currProducts[i].Product_Unit}
                    </div>
                    <div class="col-6 product-quantity ">
                        ${currProducts[i].Product_Price}đ x  ${quantity[i]} = <span class="text-orange"> ${price}đ</span>
                    </div>
                </div>
            </li>
        `);
    }
    $('.bill').append(`
            <li class="product">
                <div class="row">
                    <div class="col-6 product-desc ">
                        -> Tổng cộng: 
                    </div>
                    <div class="col-6 product-quantity">
                        <input class="text-orange mx-4" readonly name="totalPrice" value="${totalPrice}">đ
                    </div>
                </div>
            </li>
        `);
};