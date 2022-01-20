$('.small').click(function (event) {
    $('.big')[0].src = event.target.src;
})


const pLists = document.querySelector('.search-menu');
const searchBar = document.getElementById('searchBar');


searchBar.addEventListener('keyup', (e) => {
    const searchString = e.target.value.toLowerCase();
    const filteredProducts = products.filter( (product) => {
        return product.Product_Name.toLowerCase().includes(searchString)
    });
    const filteredPackages = packages.filter( (p) => {
        return p.P_Name.toLowerCase().includes(searchString)
    });


    pLists.innerHTML = '';
    if (searchString.length !== 0) display(filteredProducts, filteredPackages);
});


const display = (pro, pac) => {
    if (pro.length === 0 && pac.length === 0) {
        let htmlString = `
                <li style="color:red; font-size: 1.4rem">
                    Sản phẩm/gói bạn tìm không có !
                </li>
            `;
        
        pLists.innerHTML = htmlString;
    } 
    else   {
        let packagesHtmlString;
        let productsHtmlString;

        productsHtmlString = pro
            .map((product) => {
                return `
                <li class="">
                    <a href="/manager/product/${product.Product_ID}" class="">
                        ${product.Product_Name}
                    </a> 
                </li>
            `;
            })
            .join('');


            packagesHtmlString = pac
            .map((p) => {
                let result =  `
                    <li class="">
                        <a href="/manager/package/${p.P_ID}" class="">
                            ${p.P_Name}: 
                `;

                for(let i = 0; i < p.P_ProductsID.length; i++) {
                    let id = parseInt(p.P_ProductsID[i]) -1;
                    let name = products[id].Product_Name;
        
                    if(i === 0 ) {
                        result += `${name}`;
                    }
                    else
                        result += `, ${name}`;
                }
                return result;
            })
            .join('');

        pLists.innerHTML = productsHtmlString + packagesHtmlString;
    } 
   
};


$('.packet-list #sort').click(function () {
    let key = $(this).val();
    let filterdKey = $('.packet-list #filter').val();

    let result = packages;
    if (filterdKey) {
        result = packages.filter((p) => {
            return p.P_Type == filterdKey;
       });
    }
    

    if (key == "tăng") {
        result.sort(function(a,b){
            return a.P_SoldQuantity - b.P_SoldQuantity;
        });
        $('.option #sort').css('width', '23.4rem');
    }
    else if (key == "giảm") {
        result.sort(function(a,b){
            return b.P_SoldQuantity - a.P_SoldQuantity;
        });
        $('.option #sort').css('width', '23.4rem');
    }
    else {
        $('.option #sort').css('width', '12.8rem');
    }

    displayPackages(result);


})

$('.packet-list #filter').click(function () {
    let key = $('.packet-list #sort').val();
    let filterdKey = $(this).val();

    let result = packages;
    if (filterdKey) {
        result = packages.filter((p) => {
            return p.P_Type == filterdKey;
       });
    }
    

    if (key == "tăng") {
        result.sort(function(a,b){
            return a.P_SoldQuantity - b.P_SoldQuantity;
        });
        $('.option #sort').css('width', '23.4rem');
    }
    else if (key == "giảm") {
        result.sort(function(a,b){
            return b.P_SoldQuantity - a.P_SoldQuantity;
        });
        $('.option #sort').css('width', '23.4rem');
    }
    else {
        $('.option #sort').css('width', '12.8rem');
    }

    displayPackages(result);
})


$('.product-list #sort').click(function () {
    let key = $(this).val();
    let filterdKey = $('.product-list #filter').val();

    let result = products;
    if (filterdKey) {
        result = products.filter((p) => {
            return p.Product_Type == filterdKey;
       });
    }
    

    if (key == "tăng") {
        result.sort(function(a,b){
            return a.Product_SoldQuantity - b.Product_SoldQuantity;
        });
        $('.option #sort').css('width', '23.4rem');
    }
    else if (key == "giảm") {
        result.sort(function(a,b){
            return b.Product_SoldQuantity - a.Product_SoldQuantity;
        });
        $('.option #sort').css('width', '23.4rem');
    }
    else {
        $('.option #sort').css('width', '12.8rem');
    }

    displayProducts(result);
    console.log(result);

})

$('.product-list #filter').click(function () {
    let key = $('.product-list #sort').val();
    let filterdKey = $(this).val();

    let result = products;
    if (filterdKey) {
        result = products.filter((p) => {
            return p.Product_Type == filterdKey;
       });
    }
    

    if (key == "tăng") {
        result.sort(function(a,b){
            return a.Product_SoldQuantity - b.Product_SoldQuantity;
        });
        $('.option #sort').css('width', '23.4rem');
    }
    else if (key == "giảm") {
        result.sort(function(a,b){
            return b.Product_SoldQuantity - a.Product_SoldQuantity;
        });
        $('.option #sort').css('width', '23.4rem');
    }
    else {
        $('.option #sort').css('width', '12.8rem');
    }

    displayProducts(result);
    console.log(result);

})

const displayPackages = (packages) => {
    let htmlString; 
    
    htmlString = packages.map( (p) => {
        let result = `
            <div class="col-3 my-3">
                <div class="card" style="width: 100%; box-shadow: 0 2px 4px rgba(0, 0, 0, .15), 0 8px 16px rgba(0, 0, 0, .15);">
                    <img src="${p.P_Image}" class="card-img-top" height="200" alt="...">
                    <div class="card-body">
                    <h4 class="card-title">${p.P_Name}</h4>
                    <p class="card-text text-ellipsis--2 fs-5" style="height: 40px;">Bao gồm:
        `;

        for(let i = 0; i < p.Product_List.length; i++) {
            if (i == p.Product_List.length - 1) {
                result += `
                    ${p.Product_List[i]}
                `
            }
            else {
                result += `
                ${p.Product_List[i]},
            `
            }
        }

        result += `
                    </p>
                    <p class="card-text d-flex flex-row-reverse" style="color: red; font-style:italic; font-size: 1.2rem!important;">
                        Đã bán: ${p.P_SoldQuantity}
                    </p>
                    <a href="/manager/package/${p.P_ID}" class="btn btn-primary fs-4">Xem chi tiết </a>
                    </div>
                </div>
            </div>
        `
        return result;
    }).join('');

    // console.log(htmlString)
    $('.section-content .row').html(htmlString);
}


const displayProducts = (products) => {
    let htmlString; 
    
    htmlString = products.map( (p) => {
        let result = `
        <div class="col-3 my-3" >
            <div class="card" style="width: 100%; box-shadow: 0 2px 4px rgba(0, 0, 0, .15), 0 8px 16px rgba(0, 0, 0, .15);">
                <img src="${p.Product_MainImage}" class="card-img-top" height="200" alt="..." >
                <div class="card-body">
                    <h4 class="card-title fs-2">${p.Product_Name}</h4>
                    <p class="card-text  text-ellipsis--3 fs-4 mb-1">Giá: ${p.Product_Price} ₫ </p>
                    <p class="card-text  text-ellipsis--3 fs-4 mb-1">Đơn vị: ${p.Product_Unit}</p>
                    <p class="card-text d-flex flex-row-reverse" style="color: red; font-style:italic; font-size: 1.2rem!important;">
                        Đã bán: ${p.Product_SoldQuantity}
                    </p>
                    <a href="/manager/product/${p.Product_ID}" class="btn btn-primary fs-5">Xem chi tiết </a>
                </div>
            </div>
        </div>
        `

        return result;
    }).join('');

    $('.section-content .row').html(htmlString);
}

