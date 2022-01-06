var myDiv = document.querySelector(".col-9 .not-paid");

document.body.scrollTop = myDiv.offsetHeight - 780; // For Safari
document.documentElement.scrollTop =  myDiv.offsetHeight -780 ; // For Chrome, Edge, ...