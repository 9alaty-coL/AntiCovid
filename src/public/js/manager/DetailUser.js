// Validate Status Form JS
$("#ChangeStatusForm").submit(function () {
    if ($("#from").val() === $("#to :selected").val()) {
        alert("Trạng thái sau khi chuyển bằng trạng thái ban đầu");
        return false;
    }
})

// Validate location form JS
$("#ChangeLocationForm").submit(function () {
    let inputLocation = $("#searchBarTreatPlace").val();
    let currentLocation = $("#CurrentTreatPlaceName").text();

    let index = treatmentPlaces.findIndex(i => i.name === inputLocation);

    // Check exist
    if (index === -1) {
        alert("Nơi điều trị được chọn không tồn tại!");
        return false;
    }
    // Check full
    if (treatmentPlaces[index].current >= treatmentPlaces[index].capacity) {
        alert("Nơi điều trị được chọn đã đầy!");
        return false;
    }
    // Check same
    if (currentLocation === inputLocation) {
        alert("Nơi điều trị được chọn giống với nơi ban đầu");
        return false;
    }

    $("#IDsearchBarTreatPlace").val(treatmentPlaces[index]._id);
})

// JS for update time
setInterval(function () {
    let time = (new Date()).toString().slice(0, 24);
    $("#Time").text(time);
}, 1000);

// Lowercase for Vietnamese
function nonAccentVietnamese(str) {
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // Huyền sắc hỏi ngã nặng 
    str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // Â, Ê, Ă, Ơ, Ư
    return str;
}

// Search Treatment Place
const placeLists = document.getElementById('searchBarTreatPlace');
const searchBarPlace = document.getElementById('menuBarTreatPlace');

let treatmentPlaces = [];

const loadTreatments = async () => {
    try {
        const res = await fetch('/manager/treatmentplace');
        treatmentPlaces = await res.json();
    } catch (err) {
        console.error(err);
    }
};

loadTreatments();

// show 10 results
const displayTreatmentPlaces = (places) => {
    let htmlString;

    if (places.length === 0) {
        htmlString = `
            <li style="color:red; font-size: 1.4rem">
                Nơi bạn tìm không có !
            </li>   
            `;
    } else if (places.length < 10) {
        htmlString = places
            .map((places) => {
                return `
                <li class="">
                    <a class="" onclick="document.getElementById('searchBarTreatPlace').value = '${places.name}'; 
                                        document.getElementById('menuBarTreatPlace').innerHTML = '';
                                ">
                        ${places.name} → ${places.current} / ${places.capacity}
                    </a> 
                </li>
            `;
            })
            .join('');
    } else {
        let results = [];
        for (i = 0; i < 10; i++) {
            results.push(places[i]);
        }
        htmlString = results
            .map((places) => {
                return `
                <li class="">
                    <a class="" onclick="document.getElementById('searchBarTreatPlace').value = '${places.name}'; 
                                        document.getElementById('menuBarTreatPlace').innerHTML = '';
                                ">
                        ${places.name} → ${places.current} / ${places.capacity}
                    </a> 
                </li>
            `;
            })
            .join('');
    }
    $('#menuBarTreatPlace').html(htmlString);
};

$('#searchBarTreatPlace').keyup((e) => {
    const searchString = nonAccentVietnamese(e.target.value);

    const filtered = treatmentPlaces.filter((place) => {
        return nonAccentVietnamese(place.name).includes(searchString);
    });

    searchBarPlace.innerHTML = '';
    if (searchString.length !== 0) displayTreatmentPlaces(filtered);
});


