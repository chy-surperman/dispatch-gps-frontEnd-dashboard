import {request} from '@/utils/request'

export function getOverview(data){
    const url = "/analysis/route/daily/overview"
    return request.get(url,data)
}

export function getOverviewText(data){
    const url = "/analysis/route/daily/overviewText"
    return request.get(url,data)
}

export function getAllDayTimeTrip(data){
    const url = "/analysis/route/daily/allDayTimeTrip"
    return request.get(url,data)
}

export function getBusyIdleTrip(data){
    const url = "/analysis/route/daily/busyIdleTrip"
    return request.get(url,data)
}

export function getDriverTripRevenAndRuntime(data){
    const url = "/analysis/route/daily/tripRevenAndRuntime"
    return request.get(url,data)
}

export function getDriverRevenueTripDistributed(data){
    const url = "/analysis/route/daily/revenueTripDistributed"
    return request.get(url,data)
}