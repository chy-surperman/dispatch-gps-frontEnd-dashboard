<template>
    <div class="dashboard-container">
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane v-for="dataDictionary of dictionarys" :key="dataDictionary.dictionaryId" :label="dataDictionary.dictionaryName" :name="dataDictionary.dictionaryId">
                <el-row>
                    <el-col :span="3">
                        <el-upload
                            class="upload-demo"
                            :headers="headers"
                            :action="dashUrl + '/dictionary/data/import?dictionaryId=' + dataDictionary.dictionaryId"
                            :on-success="handleSuccess"
                            :multiple="false">
                            <el-button size="small" type="primary"><i class="el-icon-upload el-icon--right"></i>点击上传</el-button>
                        </el-upload>
                    </el-col>
                    <el-col :span="3">
                        <el-button type="primary" size="mini">
                            <el-link style="font:#fff" :href="dashUrl + '/dictionary/data/download?dictionaryId=' + dataDictionary.dictionaryId" :underline="false">下载导入模板<i class="el-icon-arrow-down el-icon--right"></i></el-link>
                        </el-button>
                    </el-col>
                    <el-col :span="3">
                        <el-input size="small" placeholder="请输入搜索内容" prefix-icon="el-icon-search" v-model="dataDictionary.search"></el-input>
                    </el-col>
                    <el-col :span="3">
                        <el-button type="primary" size="small" @click="_getDictionaryDatas(dataDictionary.dictionaryId)">
                            搜索
                        </el-button>
                    </el-col>
                </el-row>

                <el-row>
                    <el-table size="mini" :data="dataDictionary.datas" border highlight-current-row style="width: 100%;margin:20px;">
                        <el-table-column v-for="item of dataDictionary.cols" :key="item.id" :prop="item.columnName" :label="item.columnLabel" />
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button
                                    size="mini"
                                    @click="editDictionaryCol(scope.$index, scope.row)">编辑</el-button>
                                <el-button
                                    size="mini"
                                    type="danger"
                                    @click="_deleteDictionaryCol(scope.$index, scope.row)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-row>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import { getToken } from '@/utils/auth'
import {getDictionaryTables,getDictionaryCols,getDictionaryDatas} from '@/api/dictionary'
import { baseURL,REQ_SUCCESS } from '@/utils/APIConstans'

export default {
    name: 'dictionary_data',
    data() {
        return {
            dictionarys:[],
            headers:{},
            activeName:'',
            dashUrl:baseURL
        }
    },
    mounted(){
        this._getDictionaryTables();
        this.headers.Authorization = getToken();
    },
    methods:{
        handleSuccess(response, file, fileList){
            if(response.code == REQ_SUCCESS){
                const {dictionary,datas} = response.result;
                let index = this.dictionarys.findIndex(ele => ele.dictionaryId == dictionary.dictionaryId);
                this.$set(this.dictionarys[index],'dataCount',datas.length);
                this.$set(this.dictionarys[index],'datas',datas);
            }else{
                this.$message.error(response.define);
            }
        },
        handleClick(tab){
            this._getDictionaryCols(tab.name);
        },
        queryDatas(templateId,batchNo){
            getImportResults({templateId,batchNo}).then(resp => {
                if(resp.code == REQ_SUCCESS){
                    this.closeImportDialog();
                    const {record,datas} = resp.result;
                    let index = this.templates.findIndex(ele => ele.templateId == record.templateId);
                    this.$set(this.templates[index],'dataCount',datas.length);
                    this.$set(this.templates[index],'record',record);
                    this.$set(this.templates[index],'datas',datas);
                }
            });
        },
        _getDictionaryDatas(dictionaryId){
            const index = this.dictionarys.findIndex(ele => ele.dictionaryId == dictionaryId);
            let params = {
                dictionaryId,
                search:this.dictionarys[index].search
            };
            getDictionaryDatas(params).then(resp => {
                const {code,result} = resp;
                if(code == REQ_SUCCESS){
                    this.$set(this.dictionarys[index],'datas',result);
                }
            })
        },
        _getDictionaryTables(){
            getDictionaryTables().then(resp => {
                if(resp.code == REQ_SUCCESS){
                    this.dictionarys = resp.result;
                    if(this.dictionarys.length > 0){
                        this.activeName = this.dictionarys[0].dictionaryId;
                        this._getDictionaryCols(this.activeName);
                        this._getDictionaryDatas(this.activeName);
                    }
                }
            });
        },
        _getDictionaryCols(dictionaryId){
            let params = {dictionaryId};
            getDictionaryCols(params).then(resp => {
                const {code,result} = resp;
                if(code == REQ_SUCCESS){
                    const index = this.dictionarys.findIndex(ele => ele.dictionaryId == dictionaryId);
                    this.$set(this.dictionarys[index],'cols',result);
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.dashboard {
    &-container {
        margin: 30px;
    }
    &-text {
        font-size: 30px;
        line-height: 46px;
    }
}
</style>
