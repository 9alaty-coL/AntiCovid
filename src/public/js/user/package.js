$('.list .packet').parent().removeClass('d-none');
$('.list .packet').addClass('active');

$('#sort').click(function () {
    let key = $(this).val();
    let sort; 
    let sortedPackages = packages;
    if (key == "tăng") {
        sortedPackages.sort(function(a,b){
            return a.P_SoldQuantity - b.P_SoldQuantity;
        });
        displayPackages(sortedPackages);
        $('.option #sort').css('width', '23.4rem');
    }
    else if (key == "giảm") {
        sortedPackages.sort(function(a,b){
            return b.P_SoldQuantity - a.P_SoldQuantity;
        });
        displayPackages(sortedPackages);
        $('.option #sort').css('width', '23.4rem');
    }
    else {
        $('.option #sort').css('width', '12.8rem');
        displayPackages(packages);
    }


})

$('#filter').click(function () {
    let key = $(this).val();
    let sort; 
    
    if (key) {
       let filterPackages = packages.filter((p) => {
            return p.P_Type == key;
       })
       displayPackages(filterPackages);
    }
    else {
        displayPackages(packages);
    }

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
                    <a href="/user/package/${p.P_ID}" class="btn btn-primary fs-4">Xem chi tiết </a>
                    </div>
                </div>
            </div>
        `
        return result;
    }).join('');

    // console.log(htmlString)
    $('.section-content .row').html(htmlString);
}

displayPackages(packages);