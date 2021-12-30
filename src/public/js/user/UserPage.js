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

// Search novel
const novelLists = document.querySelector('.search-menu');
const searchBar = document.getElementById('searchBar');

let novels = [];

const loadNovels = async () => {
    try {
        const res = await fetch('https://hp-api.herokuapp.com/api/characters');
        novels = await res.json();
    } catch (err) {
        console.error(err);
    }
};

loadNovels();

searchBar.addEventListener('keyup', (e) => {
    const searchString = e.target.value.toLowerCase();
    const filteredNovels = novels.filter((novel) => {
        return novel.name.toLowerCase().includes(searchString);
    });
    novelLists.innerHTML = '';
    if (searchString.length !== 0) displayNovels(filteredNovels);
});

// show 10 results
const displayNovels = (novels) => {
    let htmlString;

    if (novels.length === 0) {
        htmlString = `
                <li style="color:red; font-size: 1.4rem">
                    Truyện bạn tìm không có !
                </li>
            `;
    } else if (novels.length < 10) {
        htmlString = novels
            .map((novel) => {
                return `
                <li class="">
                    <a href="#" class="">
                        ${novel.name}
                    </a> 
                </li>
            `;
            })
            .join('');
    } else {
        let results = [];
        for (i = 0; i < 10; i++) {
            results.push(novels[i]);
        }
        htmlString = results
            .map((novel) => {
                return `
                <li class="">
                    <a href="#" class="">
                        ${novel.name}
                    </a> 
                </li>
            `;
            })
            .join('');
    }
    novelLists.innerHTML = htmlString;
};
