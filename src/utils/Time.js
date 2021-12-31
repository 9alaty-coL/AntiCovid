const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

class Time {    
    
    getNow() {
        const d = new Date();

        let WeekDay = weekday[d.getDay()];
        let Day = d.getDate();
        let Month = month[d.getMonth()];
        let Year = d.getFullYear();

        return WeekDay + ", " + Day + " " + Month + " " + Year;
    }
}

module.exports = new Time();