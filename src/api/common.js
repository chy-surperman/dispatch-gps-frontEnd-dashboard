import {request} from '@/utils/request'

export function getRouteGroup(){
    const url = "/organization/route/group"
    return request.get(url)
}


export function getRouteNames(data){
    const url = "/organization/route/names"
    return request.get(url,data)
}
