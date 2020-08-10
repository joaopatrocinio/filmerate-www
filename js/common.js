var url_api = "https://server.filmerate.com/api/";
//var url_api = "http://127.0.0.1:3000/api/";
moment.locale('en');
function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(window.atob(base64));
};
function urlParam(name){
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results==null) {
       return null;
    }
    return decodeURI(results[1]) || 0;
}
function openTab(evt, cityName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(cityName).style.display = "block";
    evt.currentTarget.className += " active";
}
window.onhashchange = function () {
    window.scrollTo(0, 0);
}
document.addEventListener('click', function (event) {
	if (!event.target.matches('.filmerate-review-rate-collapse')) return;
    if (event.target.classList.contains('fa-angle-down')) {
        event.target.classList.remove('fa-angle-down');
        event.target.classList.add('fa-angle-up');
    } else {
        event.target.classList.remove('fa-angle-up');
        event.target.classList.add('fa-angle-down');
    }
}, false);
document.addEventListener('click', function (event) {
	if (!event.target.matches('.filmerate-back-icon')) return;
    window.history.back();
}, false);
function round(value, decimals) {
    return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}
