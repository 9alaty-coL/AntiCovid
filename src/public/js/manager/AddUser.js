$('#relateButton').prop('disabled', true);

// Form validation
$("#addUser").submit(function () {
    let checkVNcharOnly = /^[a-zA-Z ]*$/;

    // Check username
    let checkUsername = /^[a-zA-Z0-9]*$/;
    if (!checkUsername.test($('#username').val())) {
        alert('username không hợp lệ!');
        return false;
    }
    if ($('#username').val() === "") {
        alert('username không được trống!');
        return false;
    }

    // Check password
    if ($('#password').val() !== $('#repassword').val()) {
        alert('password và repeat password không trùng khớp!');
        return false;
    }
    if ($('#password').val() === "" || $('#repassword').val() === "") {
        alert('password không được trống!');
        return false;
    }

    // Check Họ và tên
    let nonAccentHVT = nonAccentVietnamese($('#P_FullName').val());
    if (!checkVNcharOnly.test(nonAccentHVT)) {
        alert('Họ và tên chứa ký tự không hợp lệ!');
        return false;
    }
    if ($('#P_FullName').val() === "") {
        alert('Họ và tên không được trống!');
        return false;
    }

    // Check Id card
    if ($('#P_IdentityCard').val() === "") {
        alert('ID không được trống!');
        return false;
    }

    // Check Năm sinh
    if ($('#P_YearOfBirth').val() <= 1900 || $('#P_YearOfBirth').val() > (new Date()).getFullYear()) {
        alert(`Năm sinh không hợp lệ! (1900 < BirthYear < ${(new Date()).getFullYear()})`);
        return false;
    }

    // Không check địa chỉ
    if ($('#P_Address').val() === "") {
        alert('Địa chỉ không được trống!');
        return false;
    }

    // Check nơi điều trị - Check exist - Check full
    let inputLocation = $("#searchBarTreatPlace").val();
    let index = treatmentPlaces.findIndex(i => i.name === inputLocation);

    if (index === -1) {
        alert("Nơi điều trị được chọn không tồn tại!");
        return false;
    }
    if (treatmentPlaces[index].current >= treatmentPlaces[index].capacity) {
        alert("Nơi điều trị được chọn đã đầy!");
        return false;
    }
    $("#IDsearchBarTreatPlace").val(treatmentPlaces[index]._id);
});

//>>>>>>>> Search relate bar
function setRelate(P_FullName, P_RelateGroup) {
    $('#searchBarRelate').addClass("text-success");
    $('#inputOutline').addClass("border-success");
    $('#searchBarRelate').val(P_FullName);
    $('#IDsearchBarRelate').val(P_RelateGroup);
    $('#menuBarRelate').html('');
}

function resetRelate() {
    buttonRelate(true);
    $('#searchBarRelate').removeClass("text-success");
    $('#inputOutline').removeClass("border-success");
    $('#searchBarRelate').val('');
    $('#IDsearchBarRelate').val(0);
}

function buttonRelate(isOn) {
    $('#relateButton').prop('disabled', isOn);
}

// Search Treatment Place
const listRelate = document.getElementById('searchBarRelate');
const barRelate = document.getElementById('menuBarRelate');


let relate = [];

const loadRelate = async () => {
    try {
        const res = await fetch('/manager/relate');
        relate = await res.json();
        console.log(relate);
        filterRelate();
    } catch (err) {
        console.error(err);
    }
};

loadRelate();

// show 10 results
const displayRelate = (data) => {
    let htmlString;

    if (data.length === 0) {
        htmlString = `
                <li style="color:red; font-size: 1.4rem">
                    Người liên đới bạn tìm không có !
                </li>
            `;
    } else if (data.length < 10) {
        htmlString = data
            .map((d) => {
                return `
                <li class="row searchbar-hover" onclick="setRelate('${d.P_FullName} - Status: ${d.P_Status} - ID: ${d.P_IdentityCard}', '${d.P_RelateGroup}'); buttonRelate(false);">
                    <div class="col-6">${d.P_FullName}</div>
                    <div class="col-3">Status: ${d.P_Status}</div>
                    <div class="col-3">ID: ${d.P_IdentityCard}</div>
                </li>
            `;
            })
            .join('');
    } else {
        let results = [];
        for (i = 0; i < 10; i++) {
            results.push(data[i]);
        }
        htmlString = results
            .map((d) => {
                return `
                <li class="row searchbar-hover" onclick="setRelate('${d.P_FullName} - Status: ${d.P_Status} - ID: ${d.P_IdentityCard}', '${d.P_RelateGroup}'); buttonRelate(false);">
                    <div class="col-6">${d.P_FullName}</div>
                    <div class="col-3">Status: ${d.P_Status}</div>
                    <div class="col-3">ID: ${d.P_IdentityCard}</div>
                </li>
            `;
            })
            .join('');
    }
    barRelate.innerHTML = htmlString;
};

$('#searchBarRelate').keyup((e) => {
    const searchString = nonAccentVietnamese(e.target.value);

    const filtered = relate.filter((d) => {
        return nonAccentVietnamese(d.P_FullName).includes(searchString);
    });
    console.log(filtered);

    barRelate.innerHTML = '';
    if (searchString.length !== 0) displayRelate(filtered);
});

