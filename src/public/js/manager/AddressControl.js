let Province = [];
let District = [];
let Ward = [];

const loadProvince = async () => {
    try {
        const res = await fetch('/manager/province');
        Province = await res.json();
    } catch (err) {
        console.error(err);
    }
};

const loadDistrict = async () => {
    try {
        const res = await fetch('/manager/district');
        District = await res.json();
    } catch (err) {
        console.error(err);
    }
};

const loadWard= async () => {
    try {
        const res = await fetch('/manager/ward');
        Ward = await res.json();
    } catch (err) {
        console.error(err);
    }
};

loadProvince().then(()=> {
    for (i = 0; i < Province.length; i++) { 
        $('#Province').append($(`<option value="${Province[i].ProvinceID}">${Province[i].ProvinceName}</option>`));
    }
    $('#Province').removeAttr('disabled');
});

loadDistrict();
loadWard();

// Change function
function changeProvince(value) {
    $('#District').empty();
    $('#District').removeAttr('disabled');
    let DistrictByProvince = District.filter(g => g.ProvinceID === parseInt(value));
    for (i = 0; i < DistrictByProvince.length; i++) { 
        $('#District').append($(`<option value="${DistrictByProvince[i].DistrictID}">${DistrictByProvince[i].DistrictName}</option>`));
    }
    changeDistrict(1);
}

function changeDistrict(value) {
    $('#Ward').empty();
    $('#Ward').removeAttr('disabled');
    let WardByDistrict = Ward.filter(g => g.DistrictID === parseInt(value));
    let WardByProvince = WardByDistrict.filter(g => g.ProvinceID === parseInt($('#Province').val()));
    for (i = 0; i < WardByProvince.length; i++) { 
        $('#Ward').append($(`<option value='${WardByProvince[i].WardName}'>${WardByProvince[i].WardName}</option>`));
    }
}