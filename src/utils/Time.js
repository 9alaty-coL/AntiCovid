const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

class Time {        
    getNow() {
        return (new Date()).toString().slice(0,24);
    }
}

module.exports = new Time();