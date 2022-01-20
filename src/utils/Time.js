const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

class Time {        
    getNow() {
        return (new Date()).toString().slice(0,24);
    }
    createDate(month, year) {
        let date = new Date();
        date.setMonth(month);
        date.setYear(year);
        return date;
    }
    isMonthBetween(from, to, date) {
        // set from to min date in month format
        let newFrom = from.setDate(1);
        // set to to max date in month format
        let newTo = new Date(to.getFullYear(), to.getMonth() + 1, 0);
        // Compare date between from and to
        return (newFrom <= date && date <= newTo);
    }
    
    isMonthIn(month, date) {
        return (month.getMonth() === date.getMonth());
    }
}

module.exports = new Time();