import {request} from '@/utils/request'

// 字典表
export function getDictionaryTables(){
    const url = "/dictionary/setting/table/list"
    return request.get(url)
}

export function saveDictionaryTable(data){
    const url = "/dictionary/setting/table/save"
    return request.get(url,data);
}

export function deleteDictionaryTable(data){
    const url = "/dictionary/setting/table/remove"
    return request.get(url,data);
}

// 字典表列
export function getDictionaryCols(data){
    const url = "/dictionary/setting/col/list"
    return request.get(url,data);
}
export function saveDictionaryCol(data){
    const url = "/dictionary/setting/col/save"
    return request.get(url,data);
}
export function deleteDictionaryCol(data){
    const url = "/dictionary/setting/col/remove"
    return request.get(url,data);
}

// 字典数据
export function getDictionaryDatas(data){
    const url = "/dictionary/data/list"
    return request.get(url,data);
}
export function saveDictionaryData(data){
    const url = "/dictionary/data/save"
    return request.get(url,data);
}
export function updateDictionaryData(data){
    const url = "/dictionary/data/update"
    return request.get(url,data);
}
export function deleteDictionaryData(data){
    const url = "/dictionary/data/remove"
    return request.get(url,data);
}

// 查询排班间隔
export function getWorkplanIntervals(params){
	const url = "/workplan/interval/all";
	return api.get(url,params)
}

// 保存排班间隔
export function saveWorkplanInterval(params){
	const url = "/workplan/interval/save";
	return api.post(url,params)
}

// 删除排班间隔
export function deleteWorkplanInterval(params){
	const url = "/workplan/interval/delete";
	return api.get(url,params)
}
