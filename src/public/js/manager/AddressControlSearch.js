let Province = [];
let District = [];
let Ward = [];

let searchParams = new URLSearchParams(window.location.search);

searchParams.has('Province'); console.log(searchParams.get('Province'));
searchParams.has('District'); console.log(searchParams.get('District'));

var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
    return null;
};

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

function backDataSearch() {
    ProvinceID = searchParams.get('Province');
    DistrictID = searchParams.get('District');
    WardName = searchParams.get('Ward');

    if (ProvinceID !== null && ProvinceID !== "") {
        $('#Province').val(ProvinceID).attr('selected','selected');
        changeProvince(ProvinceID);
        if (DistrictID !== null && DistrictID !== "") {
            $('#District').val(DistrictID).attr('selected','selected');
            changeDistrict(DistrictID);
            if (WardName !== null && WardName !== "") $('#Ward').val(WardName).attr('selected','selected');
        }
    }
}

loadProvince().then(()=> {
    for (i = 0; i < Province.length; i++) { 
        $('#Province').append($(`<option value="${Province[i].ProvinceID}">${Province[i].ProvinceName}</option>`));
    }
    $('#Province').removeAttr('disabled');
});

loadDistrict().then(()=> {
    backDataSearch();
});
loadWard().then(()=> {
    backDataSearch();
});

// Change function
function changeProvince(value) {
    $('#District').removeAttr('disabled');
    $('#District').empty();
    $('#District').append($(`<option class="text-form" value="" selected>[Chọn] Quận Huyện</option>`));
    let DistrictByProvince = District.filter(g => g.ProvinceID === parseInt(value));
    for (i = 0; i < DistrictByProvince.length; i++) { 
        $('#District').append($(`<option value="${DistrictByProvince[i].DistrictID}">${DistrictByProvince[i].DistrictName}</option>`));
    }
    changeDistrict(1);
}

function changeDistrict(value) {
    $('#Ward').removeAttr('disabled');
    $('#Ward').empty();
    $('#Ward').append($(`<option class="text-form" value="" selected>[Chọn] Phường Xã</option>`));
    let WardByDistrict = Ward.filter(g => g.DistrictID === parseInt(value));
    let WardByProvince = WardByDistrict.filter(g => g.ProvinceID === parseInt($('#Province').val()));

    for (i = 0; i < WardByProvince.length; i++) { 
        $('#Ward').append($(`<option value='${WardByProvince[i].WardName}'>${WardByProvince[i].WardName}</option>`));
    }
}