// console.log(new Date().getTime());
const dayjs = require("dayjs");

let time = dayjs()
    .startOf('second')
    .add(1, 'day')
    .set('year', 2018)
    .format('YYYY-MM-DD HH:mm:ss');

console.log(time);