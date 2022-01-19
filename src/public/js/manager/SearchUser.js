// Validate form
function validateForm() {
    if ($("#P_FullName").val() === "" && 
        $("#P_YearOfBirth").val() === "" && 
        $("#P_IdentityCard").val() === "" &&
        $("#P_Status :selected").val() === "" &&
        $("#Province").val() === null && 
        $("#P_HospitalAddress").val() === "") {
            alert("Điều kiện tìm kiếm không hợp lệ")
            return false;
        }
    return true;
}

// Generate Key Value
function submitSearch() {
    // //> Submit
    $("#searchForm").attr("action", "/manager/search");
}

// Search menuBarTreatPlace
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