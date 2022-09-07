<template>
    <div class="dashboard-container">
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane v-for="excelTemplate of templates" :key="excelTemplate.templateId" :label="excelTemplate.templateName" :name="excelTemplate.templateId">
                <el-row>
                    <el-col :span="3">
                        <el-upload
                            class="upload-demo"
                            :headers="headers"
                            :action="dashUrl + '/excel/import/data?templateId=' + excelTemplate.templateId"
                            :on-success="handleSuccess"
                            :multiple="false">
                            <el-button size="mini" type="primary"><i class="el-icon-upload el-icon--right"></i>点击上传</el-button>
                        </el-upload>
                    </el-col>
                    <el-col :span="3">
                        <el-button size="mini" type="primary" @click="showImportRecordsDialog(excelTemplate.templateId)">导入记录</el-button>
                    </el-col>
                    <el-col :span="3">
                        <el-dropdown @command="downCommand">
                            <el-button type="primary" size="mini">
                                <el-link style="font:#fff" :href="dashUrl + '/excel/template/download?templateId=' + excelTemplate.templateId" :underline="false">下载导入模板<i class="el-icon-arrow-down el-icon--right"></i></el-link>
                            </el-button>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item :command="{directive:'initTemplate',templateId:excelTemplate.templateId}">初始化模板</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </el-col>
                </el-row>

                <el-row>
                    <el-table size="mini" height="500" :data="excelTemplate.datas" border highlight-current-row style="width: 100%;margin:20px 0 120rpx 0;">
                        <el-table-column v-for="item of excelTemplate.cols" :key="item.id" :prop="item.columnName" :label="item.columnLabel" />
                    </el-table>
                </el-row>

                <div class="confim-box" v-if="excelTemplate.record && excelTemplate.record.importStatus == 1">
                    <el-divider content-position="center">已导入：{{excelTemplate.dataCount}} 条记录</el-divider>
                    <el-row>
                        <el-col :offset="10" :span="2">
                            <el-button @click="_cancelImport(excelTemplate.record.templateId,excelTemplate.record.batchNo,true)" size="small" type="primary">取消</el-button>
                        </el-col>
                        <el-col :span="2">
                            <el-button @click="_confirmImport(excelTemplate.record.templateId,excelTemplate.record.batchNo,true)" size="small" type="primary">确认</el-button>
                        </el-col>
                    </el-row>
                </div>
            </el-tab-pane>
        </el-tabs>
        <el-dialog title="导入记录" width="60%" :modal="true" :show-close="false" 
                   :close-on-click-modal="false" center :visible.sync="dialogImportRecordVisible">
            <el-table size="mini" :data="importRecords" border highlight-current-row style="width: 100%;margin-top:20px;">
                <el-table-column width="100" prop="fileName" label="文件名" />
                <el-table-column width="150" prop="batchNo" label="批次号" />
                <el-table-column width="150" prop="importStatusStr" label="导入状态" />
                <el-table-column width="150" prop="importTimeStr" label="导入时间" />
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button size="mini"  v-if="scope.row.importStatus == 1" 
                            @click="_cancelImport(scope.row.templateId,scope.row.batchNo)">取消导入</el-button>
                        <el-button size="mini"  v-if="scope.row.importStatus == 1" 
                            @click="_confirmImport(scope.row.templateId,scope.row.batchNo)">确认导入</el-button>
                        <el-button size="mini"  v-if="scope.row.importStatus == 1 || scope.row.importStatus == 3" 
                            @click="queryDatas(scope.row.templateId,scope.row.batchNo)">查看</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <span slot="footer" class="dialog-footer">
                <el-button  size="small" @click="closeImportDialog">取 消</el-button>
                <el-button  type="primary" size="small" @click="closeImportDialog">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog title="初始化模板" width="45%" :modal="true" :show-close="false" 
                   :close-on-click-modal="false" center :visible.sync="dialogInitTemplateVisible">
            <el-transfer v-model="rightSelect" :titles="['原字段', '已选择字段']" :data="initCols" @change="rightItemChange"></el-transfer>
            <span slot="footer" class="dialog-footer">
                <el-button  size="small" @click="closeInitTemplateDialog">取 消</el-button>
                <el-button  type="primary" size="small">
                    <el-link style="font:#fff" :href="downloadTemplateUrl" :underline="false">下载导入模板</el-link>
                </el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { getToken } from '@/utils/auth'
import axios from 'axios'
import {getTemplatesByCategory,getImportRecords,getImportResults,cancelImport,confirmImport,getInitCols} from '@/api/excel'
import { baseURL,REQ_SUCCESS } from '@/utils/APIConstans'

export default {
    name: 'incomeData',
    data() {
        return {
            templates:[],
            importRecords:[],
            dataCount:0,
            headers:{},
            activeName:'',
            dashUrl:baseURL,
            dialogImportRecordVisible:false,
            rightSelect:[],
            initCols:[],
            dialogInitTemplateVisible:false,
            downloadTemplateUrl:''
        }
    },
    mounted(){
        this._getTemplatesByCategory();
        this.headers.Authorization = getToken();
    },
    methods:{
        handleSuccess(response, file, fileList,templateId){
            if(response.code == REQ_SUCCESS){
                const {record,datas} = response.result;
                let index = this.templates.findIndex(ele => ele.templateId == record.templateId);
                this.$set(this.templates[index],'dataCount',datas.length);
                this.$set(this.templates[index],'record',record);
                this.$set(this.templates[index],'datas',datas);
            }else{
                this.$message.error(response.define);
            }
        },
        handleClick(tab){
            this.activeName = tab.name;
        },
        downCommand(command){
            if(command.directive == 'initTemplate'){
                this.showInitTemplateDialog(command.templateId);
            }
        },
        showInitTemplateDialog(templateId){
            getInitCols({templateId}).then(resp => {
                const {code,result} = resp;
                const selectCols = [];
                if(code == REQ_SUCCESS){
                    result.forEach(ele => {
                         ele.key = ele.columnName;
                         ele.label = ele.columnLabel;
                         if(ele.columnCategory == 'join'){
                             selectCols.push(ele.columnName);
                         }
                    });
                    this.initCols = result;
                    this.rightSelect = selectCols;
                    this.setDownloadTemplateUrl(templateId,selectCols);
                    this.dialogInitTemplateVisible = true;
                }
            })
        },
        closeInitTemplateDialog(){
            this.dialogInitTemplateVisible = false;
            this.initCols = [];
            this.rightSelect = [];
        },
        setDownloadTemplateUrl(templateId,cols){
            this.downloadTemplateUrl = this.dashUrl + 
                                       '/excel/template/download?templateId=' + 
                                       templateId + 
                                       '&cols=' + 
                                       cols.join(",");
        },
       
        rightItemChange(value,direction,moveArr){
            this.setDownloadTemplateUrl(this.activeName,value);
        },
        _cancelImport(templateId,batchNo,isToolbar){
            let params = {templateId,batchNo};
            cancelImport(params).then(resp => {
                if(resp.code == REQ_SUCCESS){
                    if(isToolbar){
                        this.queryDatas(templateId,batchNo);
                    }else{
                        this._getImportRecords(templateId);
                    }
                }
            });
        },
        _confirmImport(templateId,batchNo,isToolbar){
            let params = {templateId,batchNo};
            confirmImport(params).then(resp => {
                if(resp.code == REQ_SUCCESS){
                    if(isToolbar){
                        this.queryDatas(templateId,batchNo);
                    }else{
                        this._getImportRecords(templateId);
                    }
                }
            });
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
        showImportRecordsDialog(templateId){
            this._getImportRecords(templateId);
            this.dialogImportRecordVisible = true;
        },
        closeImportDialog(){
            this.dialogImportRecordVisible = false;
            this.importRecords = [];
        },
        _getImportRecords(templateId){
            getImportRecords({templateId}).then(resp => {
                if(resp.code == REQ_SUCCESS){
                    this.importRecords = resp.result;
                }
            })
        },
        _getTemplatesByCategory(){
            let params = {
                templateType:2
            }
            getTemplatesByCategory(params).then(resp => {
                if(resp.code == REQ_SUCCESS){
                    this.templates = resp.result;
                    if(this.templates.length > 0)
                        this.activeName = this.templates[0].templateId;
                }
            });
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
.import-data-table {
    margin-bottom: 100px;
}
.confim-box {
    position: fixed;
    z-index: 3;
    bottom: 0;
    background-color: #fff;
    width: 90%;
    height: 100px;
}
</style>
