const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

class Time {        
    // getNow() {
    //     const d = new Date();

    //     let WeekDay = weekday[d.getDay()];
    //     let Day = d.getDate();
    //     let Month = month[d.getMonth()];
    //     let Year = d.getFullYear();

    //     return WeekDay + ", " + Day + " " + Month + " " + Year;
    // }

    // getNowDetail() {
    //     const d = new Date();

    //     let Hour = d.getHours();
    //     let Minute = d.getMinutes();
    //     let Second = d.getSeconds();
    //     let WeekDay = weekday[d.getDay()];
    //     let Day = d.getDate();
    //     let Month = month[d.getMonth()];
    //     let Year = d.getFullYear();

    //     return WeekDay + ", " + Day + " " + Month + " " + Year + ", " + Hour + ":" + Minute + ":" + Second;
    // }

    getNow() {
        return (new Date()).toString().slice(0,24);
    }
}

module.exports = new Time();