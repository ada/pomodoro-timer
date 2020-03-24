/* 
  Check wheter an object is empty or undefined
*/
export function isEmptyObject(obj) {
  return Object.entries(obj).length === 0 && obj.constructor === Object
}

export function MMSS(ms) {
  var date = new Date(0);
  date.setMilliseconds(ms);
  return date.toISOString().substr(14, 5);
}

export function toMinutes(ms) {
  var date = new Date(0);
  date.setMilliseconds(ms);
  return (ms/1000)/60
}