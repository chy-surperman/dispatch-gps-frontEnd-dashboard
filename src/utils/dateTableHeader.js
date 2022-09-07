export function getTableHeader(workdate,width){
    let datestr = workdate.split("-");
    let date = new Date(parseInt(datestr[0]),parseInt(datestr[1]),0);

    let endIndex = date.getDate()
    let startDate = new Date(parseInt(datestr[0]),parseInt(datestr[1]) - 1, 1);
    
    let dayArr = [];
    for(let i = 0; i < endIndex; i++){
        let day = startDate.getDate() + i;
        let dayStr = "v" + day;
        let dayObj = {
            id:i,
            width,
            dayStr:dayStr,
            day:day + ""
        }
        dayArr.push(dayObj);
    }
    return dayArr;
}