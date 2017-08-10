var arr = [10,20,30,90,100,110,120,200];

var o = {
  bigEnough: function(value) {
    return value > 100;
  }
}

var o2 = {
  bigEnough: function(value) {
    return value > 50;
  }
}

var filterArr = arr.filter(function(value) {
  return this.bigEnough(value);
}, o);

var filterArr2 = arr.filter(function(value) {
  return this.bigEnough(value);
}, o2);

console.log(filterArr);
console.log(filterArr2);