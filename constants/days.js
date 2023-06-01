const weekDays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const map = new Map();
map.set("Sunday", 0);
map.set("Monday", 1);
map.set("Tuesday", 2);
map.set("Wednesday", 3);
map.set("Thursday", 4);
map.set("Friday", 5);
map.set("Saturday", 6);

function getDaysInMonthUTC(month, year) {
  var date = new Date(Date.UTC(year, month, 1));
  var days = [];
  while (date.getUTCMonth() === month) {
    days.push(new Date(date));
    date.setUTCDate(date.getUTCDate() + 1);
  }
  return days;
}

function getDaysInMonthWithWeekdayUTC(month, year, day) {
  var date = new Date(Date.UTC(year, month, 1));
  var days = [];
  while (date.getUTCMonth() === month) {
    if (date.getUTCDay() === day) {
      days.push(new Date(date));
    }
    date.setUTCDate(date.getUTCDate() + 1);
  }
  return days;
}

module.exports = {
  weekDays,
  map,
  getDaysInMonthUTC,
  getDaysInMonthWithWeekdayUTC,
};
