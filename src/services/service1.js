exports.date_forme_en = function(date){
    let d = new Date(date);
    let year = d.getFullYear().toString();
    let month = d.getMonth() + 1;
    if(month < 10)month = '0' + month.toString();
    else month = month.toString();
    let day = d.getDay() + 1;
    if(day < 10)day = '0' + day.toString();
    else day = day.toString();
    let result = year + "-" + month + "-" + day;
    return result;
};