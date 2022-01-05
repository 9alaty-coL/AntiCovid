// Change placeholder
$('#searchBar').attr("placeholder","Tìm kiếm theo tên người liên quan Covid-19")

// Search UserName
const list = document.querySelector('.search-menu');
const bar = document.getElementById('searchBar');

let data = [];

const loadData = async () => {
    try {
        const res = await fetch('/manager/username');
        data = await res.json();
        console.log(data);
    } catch (err) {
        console.error(err);
    }
};

loadData();

bar.addEventListener('keyup', (e) => {
    console.log(e.target.value);
    const searchString = nonAccentVietnamese(e.target.value);
    const filtered = data.filter((d) => {
        return nonAccentVietnamese(d).includes(searchString);
    });
    list.innerHTML = '';
    if (searchString.length !== 0) display(filtered);
});

// show 10 results
const display = (data) => {
    let htmlString;

    if (data.length === 0) {
        htmlString = `
                <li style="color:red; font-size: 1.4rem">
                    Người bạn tìm không có !
                </li>
            `;
    } else if (data.length < 10) {
        htmlString = data
            .map((d) => {
                return `
                <li class="">
                    <a href="/manager/search?P_FullName=${d}" class="">
                        ${d}
                    </a> 
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
                <li class="">
                    <a href="/manager/search?P_FullName=${d}" class="">
                        ${d}
                    </a> 
                </li>
            `;
            })
            .join('');
    }
    list.innerHTML = htmlString;
};