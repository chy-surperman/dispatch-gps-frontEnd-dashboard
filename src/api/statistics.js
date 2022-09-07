import {request} from '@/utils/request'

//统计趟次 
export function driverWorkplan(data){
    const url = "/statistics/workplan/driver";
    return request.get(url,data);
}
export function vehicleWorkplan(data){
    const url = "/statistics/workplan/vehicle";
    return request.get(url,data);
}
export function driverVehicleWorkplan(data){
    const url = "/statistics/workplan/driverVehicle";
    return request.get(url,data);
}
export function groupWorkplan(data){
    const url = "/statistics/workplan/group";
    return request.get(url,data);
}

//营收统计
export function statisticsRevenue(data){
    const url = "/statistics/income/revenue";
    return request.get(url,data);
}

export function statisticsPersonflow(data){
    const url = "/statistics/income/personflow";
    return request.get(url,data);
}

export function statisticsRouteRevenue(data){
    const url = "/statistics/income/routeRevenue";
    return request.get(url,data);
}

export function statisticsRoutePersonflow(data){
    const url = "/statistics/income/routePersonflow";
    return request.get(url,data);
}

//现金统计
export function statisticsCash(data){
    const url = "/statistics/income/cash";
    return request.get(url,data);
}
export function statisticRouteCash(data){
    const url = "/statistics/income/routeCash";
    return request.get(url,data);
}

// 经营日报
export function getDailyReport(data){
    const url = "/statistics/operating/daily";
    return request.get(url,data);
}

export function getEconomicMoththlyReport(data){
    const url = "/statistics/operating/economicMoththly";
    return request.get(url,data);
}

export function getRouteOperationReport(data){
    const url = "/statistics/operating/operation";
    return request.get(url,data);
}

export function getRouteTotalDailyReport(data){
    const url = "/statistics/operating/routeTotalDaily";
    return request.get(url,data);
}

//驾驶员上报IC卡统计
export function getReportIcCardRouteNames(){
    const url = "/statistics/income/reportIcCard/routeName";
    return request.get(url);
}

export function statisticsVehicleReportIcCard(data){
    const url = "/statistics/income/reportIcCard/vehicle";
    return request.get(url,data);
}

export function statisticsDriverReportIcCard(data){
    const url = "/statistics/income/reportIcCard/driver";
    return request.get(url,data);
}

//车辆里程上报统计
export function getStatisticsVehicleReportMielage(data){
    const url = "/statistics/reportMileage/vehicle";
    return request.get(url,data);
}


//超速
export function querySpeedingDetail(data){
    const url = "/statistics/speeding/query";
    return request.get(url,data);
}

//超速
export function queryAdasDetail(data){
    const url = "/adasAlarm/getAdasAlarmList";
    return request.get(url,data);
}