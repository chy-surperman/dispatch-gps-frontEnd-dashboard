import {request} from '@/utils/request'

// 模板
export function getTemplates(){
    const url = "/excel/template/list"
    return request.get(url)
}

export function saveTemplate(data){
    const url = "/excel/template/save";
    return request.get(url,data);
}

export function deleteTemplate(data){
    const url = "/excel/template/remove";
    return request.get(url,data);
}

export function getInitCols(data){
    const url = "/excel/template/initCols";
    return request.get(url,data);
}

// 模板字段接口
export function getTemplateCols(data){
    const url = "/excel/template/col/list"
    return request.get(url,data)
}

export function saveTemplateCol(data){
    const url = "/excel/template/col/save";
    return request.get(url,data);
}

export function deleteTemplateCol(data){
    const url = "/excel/template/col/remove";
    return request.get(url,data);
}

export function getTemplatesByCategory(data){
    const url = "/excel/template/category";
    return request.get(url,data);
}

// 数据导入相关接口
export function getImportRecords(data){
    const url = "/excel/import/records";
    return request.get(url,data);
}

export function getImportResults(data){
    const url = "/excel/import/result";
    return request.get(url,data);
}

export function cancelImport(data){
    const url = "/excel/import/cancel";
    return request.get(url,data);
}
export function confirmImport(data){
    const url = "/excel/import/confirm";
    return request.get(url,data);
}

//数据字典配置相关接口
export function getExistsDictionaryCols(data){
    const url = "/excel/template/dictionaryCol/list";
    return request.get(url,data);
}
export function saveDictionaryCol(data){
    const url = "/excel/template/dictionaryCol/save";
    return request.get(url,data);
}
export function removeDictionaryCol(data){
    const url = "/excel/template/dictionaryCol/remove";
    return request.get(url,data);
}