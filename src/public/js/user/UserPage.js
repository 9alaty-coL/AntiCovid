$('.title').click(function () {
    $(this).children().toggleClass('d-none');
    $(this).parent().children('.list').toggleClass('d-none');
});
$('.list-item').click(function () {
    $('.list-item').removeClass('active');
    $(this).addClass('active');
});

$('html').click(function () {
    $('.search-menu').empty();
    $('.notification-menu').addClass('d-none');
});
$('.notification-btn').click(function (event) {
    event.stopPropagation();
    $('.notification-menu').toggleClass('d-none');
});
$('.notification-menu').click(function (event) {
    event.stopPropagation();
});

$('.small').click(function (event) {
    $('.big')[0].src = event.target.src;
})

// Search novel
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
                    <a href="/user/product/${product.Product_ID}" class="">
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
                        <a href="/user/package/${p.P_ID}" class="">
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