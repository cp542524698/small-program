function formatTime(date, fmt) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()

  if(fmt==0){
    return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
  }else if(fmt==-1){
      return [year, month, day].map(formatNumber).join('-')
  }else{
    var strs = fmt.split(":")
    var amend = parseInt(strs[0])
    if (hour > amend + 1 ){
        return false
    }else{
        return true
    }
  }
}

function IsLate(date, worktime){
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()

    var hour = date.getHours()
    var minute = date.getMinutes()
    var second = date.getSeconds()  
    var strs = new Array()
    strs = worktime.split(":")
    var _hour = parseInt(strs[0])
    var _minute = parseInt(strs[1])
    var strtime = [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
    if(_hour <= hour && _minute <= minute){
        return [false, strtime]
    }else{
        return [true, strtime]
    } 
}

var PI = Math.PI;

function getRad(d) {
    return d * PI / 180.0;
}  

function Distance(dst_lat, dst_long, lat2, lng2, accuracy){
   var lat1 = parseFloat(dst_lat)
   var lng1 = parseFloat(dst_long)

   var f = getRad((lat1 + lat2) / 2);
   var g = getRad((lat1 - lat2) / 2);
   var l = getRad((lng1 - lng2) / 2);

   var sg = Math.sin(g);
   var sl = Math.sin(l);
   var sf = Math.sin(f);

   var s, c, w, r, d, h1, h2;
   var a = 6371004;  //地球半径
   var fl = 1 / 298.257;

   sg = sg * sg;
   sl = sl * sl;
   sf = sf * sf;

   s = sg * (1 - sl) + (1 - sf) * sl;
   c = (1 - sg) * (1 - sl) + sf * sl;

   w = Math.atan(Math.sqrt(s / c));
   r = Math.sqrt(s * c) / w;
   d = 2 * w * a;
   h1 = (3 * r - 1) / 2 / c;
   h2 = (3 * r + 1) / 2 / s;

   var distance = d * (1 + fl * (h1 * sf * (1 - sg) - h2 * (1 - sf) * sg)) 
   var int_distance = parseInt(distance)
   return int_distance
}


function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  formatTime: formatTime,
  IsLate: IsLate,
  Distance: Distance,
}
