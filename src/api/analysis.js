import {request} from '@/utils/request'

export function getPanelData(){
    const url = "/dashboard/panel"
    return request.get(url)
}

export function getLineData(){
    const url = "/dashboard/line"
    return request.get(url)
}

export function getPieData(){
    const url = "/dashboard/pie"
    return request.get(url)
}

export function getRadarData(){
    const url = "/dashboard/radar"
    return request.get(url)
}


//车辆分析
export function getVehicleOperationMileage(data){
    const url = "/analysis/vehicle/mileage/compared"
    return request.get(url,data)
}

export function getVehicleTipMileageCompared(data){
    const url = "/analysis/vehicle/mileage/tripCompared"
    return request.get(url,data)
}

export function getVehicleEnergyCompared(data){
    const url = "/analysis/vehicle/energy/compared"
    return request.get(url,data)
}
export function getVehicleEnergyTripCompared(data){
    const url = "/analysis/vehicle/energy/tripCompared"
    return request.get(url,data)
}

// 司机分析
export function getDriverOperationMileage(data){
    const url = "/analysis/driver/mileage/compared"
    return request.get(url,data)
}

export function getDriverTipMileageCompared(data){
    const url = "/analysis/driver/mileage/tripCompared"
    return request.get(url,data)
}

export function getDriverEnergyCompared(data){
    const url = "/analysis/driver/energy/compared"
    return request.get(url,data)
}
export function getDriverEnergyTripCompared(data){
    const url = "/analysis/driver/energy/tripCompared"
    return request.get(url,data)
}
export function getDriverRevenue100kmOrder(data){
    const url = "/analysis/driver/revenue/100kmOrder"
    return request.get(url,data)
}
export function getDriverRevenueTripCompared(data){
    const url = "/analysis/driver/revenue/tripCompared"
    return request.get(url,data)
}

//线路
export function getRouteRevenuePersonLine(data){
    const url = "/analysis/route/revenuePersonflow"
    return request.get(url,data)
}

export function getRouteTripAvgRevenue(data){
    const url = "/analysis/route/routeTripAvgRevenue"
    return request.get(url,data)
}

//公司
export function getCompanyRevenuePersonData(data){
    const url = "/analysis/company/revenueLine"
    return request.get(url,data)
}

export function getOperationRataData(data){
    const url = "/analysis/company/operation"
    return request.get(url,data)
}