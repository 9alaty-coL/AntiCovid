// $('.img-list li:nth-child(1)').click(function () {
//     $('.big-img').empty();
//     $('.big-img').append(`
//     <img src="${currPackage.P_Image}" alt="" style="width: 100%; max-height: 500px;">
//     `)
// });

// $('.img-list li:nth-child(2)').click(function () {
//     $('.big-img').empty();
//     $('.big-img').append(`
//     <img src="https://cf.shopee.vn/file/bd65a597ecabac71c891a9a2cff45bf5" alt="" style="width: 100%; max-height: 500px;">
//     `)
// });
// $('.img-list li:nth-child(3)').click(function () {
//     $('.big-img').empty();
//     $('.big-img').append(`
//     <img src="https://cf.shopee.vn/file/f1b7225677338c28f1c5427fa448b8b3_tn" alt="" style="width: 100%; max-height: 500px;">
//     `)
// });
// $('.img-list li:nth-child(4)').click(function () {
//     $('.big-img').empty();
//     $('.big-img').append(`
//     <img src="https://cf.shopee.vn/file/e19041735fe3973c7847d8bdced1dd08_tn" alt="" style="width: 100%; max-height: 500px;">
//     `)
// });

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
                    ${currProducts[i].Product_Name} : ${quantity[i]}/${currProducts[i].Product_Unit}
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
                    ${currProducts[i].Product_Name} : ${quantity[i]}/${currProducts[i].Product_Unit}
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