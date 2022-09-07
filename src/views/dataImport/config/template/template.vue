<template>
    <div class="dashboard-container">
        <el-row>
            <el-col :span="3">
                <el-button type="primary" @click="addTemplate"><i class="el-icon-plus"></i>添加模板</el-button>
            </el-col>
        </el-row>
        <el-row>
             <el-table
                :data="tableData"
                border
                size="mini"
                style="width: 100%; margin-top: 20px">
                <el-table-column
                    prop="id"
                    label="类别"
                    width="180">
                    <template slot-scope="scope">
                        <span v-if="!scope.row.isEdit" v-text="scope.row.templateTypeStr"></span>
                        <el-select v-if="scope.row.isEdit" placeholder="请选择" v-model="scope.row.templateType" size="mini">
                            <el-option
                            v-for="item in templateTypeArr"
                            :key="item.type"
                            :label="item.typeStr"
                            :value="item.type">
                            </el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="templateName"
                    width="180"
                    label="模板名称">
                    <template slot-scope="scope">
                        <span v-if="!scope.row.isEdit" v-text="scope.row.templateName"></span>
                        <div class="time-input-box" v-if="scope.row.isEdit">
                            <input v-model="scope.row.templateName" placeholder="请输入模板名称"/>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="tableName"
                    width="200"
                    label="表名称">
                    <template slot-scope="scope">
                        <span v-if="!scope.row.isEdit" v-text="scope.row.tableName"></span>
                        <div class="time-input-box" v-if="scope.row.isEdit">
                            <input v-model="scope.row.tableName" placeholder="请输入模板表名称"/>
                        </div>
                    </template>
                    
                </el-table-column>
                <el-table-column
                    prop="parseConfig"
                    label="解析配置">
                    <template slot-scope="scope">
                        <span v-if="!scope.row.isEdit" v-text="scope.row.parseConfig"></span>
                        <div class="time-input-box" v-if="scope.row.isEdit">
                            <input v-model="scope.row.parseConfig" placeholder="请输入配置文件路径"/>
                        </div>
                    </template>                    
                </el-table-column>
                <el-table-column label="操作">

                    <template slot-scope="scope">
                        <el-button
                            size="mini"
                            v-if="scope.row.isEdit"
                            @click="save(scope.$index, scope.row)">保存</el-button>
                        <el-button
                            v-if="scope.row.isEdit"
                            size="mini"
                            type="danger"
                            @click="cancel(scope.$index, scope.row)">取消</el-button>

                        <el-button
                            size="mini"
                            v-if="!scope.row.isEdit"
                            @click="editTemplate(scope.$index, scope.row)">编辑</el-button>
                        <el-button
                            size="mini"
                            type="primary"
                            v-if="!scope.row.isEdit"
                            @click="editTemplateCol(scope.$index, scope.row)">编辑模板字段</el-button>
                        <el-button
                            size="mini"
                            type="success"
                            v-if="!scope.row.isEdit"
                            @click="settingDictionary(scope.$index, scope.row)">配置字典</el-button>
                        <el-button
                            v-if="!scope.row.isEdit"
                            size="mini"
                            type="danger"
                            @click="_deleteTemplate(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-row>
        <excelTemplateCol 
            :templateId="editeTemplateId" 
            :showTemplateColDialog="showTemplateColDialog"
            @closeDialog="closeTemplateColDialog"> </excelTemplateCol>

        <settingDictionary
            :templateId="editeTemplateId"
            :showDictionaryColDialog="showDictionaryColDialog"
            @closeDialog="closeDictionaryDialog"></settingDictionary>
        
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {getTemplates,saveTemplate,deleteTemplate} from '@/api/excel'
import { REQ_SUCCESS } from '@/utils/APIConstans'
import excelTemplateCol from './column'
import settingDictionary from './settingDictionary'

export default {
    name: 'excel_template',
    components:{
        excelTemplateCol,
        settingDictionary
    },
    data() {
        return {
            tableData:[],
            templateTypeArr:[
                {type:1,typeStr:'营收类模板'},
                {type:2,typeStr:'里程类模板'},
                {type:3,typeStr:'加油类模板'},
                {type:4,typeStr:'充电类模板'},
                {type:5,typeStr:'监管类模板'},
                {type:6,typeStr:'趟次类模板'},
            ],
            showTemplateColDialog:false,
            showDictionaryColDialog:false,
            editeTemplateId:''
        }
    },
    mounted(){
        this._getTemplates();
    },
    methods:{
        addTemplate(){
            let template = {
                templateType:'',
                templateTypeStr:'',
                templateName:'',
                tableName:'',
                isEdit:true,
                model:'add'
            }
            this.tableData.push(template);
        },
        editTemplate(index,row){
            this.$set(this.tableData[index],"model","edit");
            this.$set(this.tableData[index],"isEdit",true);
        },
        
        _deleteTemplate(index,row){
            this.$confirm('此操作将永久删除该Excel模板, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let params = {
                        templateId:row.templateId
                    }
                    deleteTemplate(params).then(resp => {
                        if(resp.code == REQ_SUCCESS){
                            this._getTemplates();
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                        }else{
                            this.$message({
                                type: 'info',
                                message: '删除失败!'
                            });
                        }
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                });          
            });
        },
        save(index,row){
            saveTemplate(row).then(resp => {
                if(resp.code == REQ_SUCCESS){
                    this.$message.success("保存成功");
                    this._getTemplates();
                }else{
                    this.$message.error(resp.define);
                }
            })
        },
        cancel(index,row){
            if(row.model == 'add'){
                this.tableData.splice(index,1);
            }else{
                this._getTemplates();
            }
        },
        editTemplateCol(index,row){
            this.editeTemplateId = row.templateId;
            this.showTemplateColDialog = true;
        },
        settingDictionary(index,row) {
            this.editeTemplateId = row.templateId;
            this.showDictionaryColDialog = true;
        },
        closeTemplateColDialog(){
            this.showTemplateColDialog = false;
        },
        closeDictionaryDialog(){
            this.showDictionaryColDialog = false;
        },
        _getTemplates(){
            getTemplates().then(resp => {
                if(resp.code == REQ_SUCCESS){
                    resp.result.forEach(ele => {
                        if(ele.templateType == 1){
                            ele.templateTypeStr = '营收类模板';
                        }else if(ele.templateType == 2){
                            ele.templateTypeStr = '里程类模板';
                        }else if(ele.templateType == 3){
                            ele.templateTypeStr = '加油类模板';
                        }else if(ele.templateType == 4){
                            ele.templateTypeStr = '充电类模板';
                        }else if(ele.templateType == 5){
                            ele.templateTypeStr = '监管类模板';
                        }else if(ele.templateType == 6){
                            ele.templateTypeStr = '趟次类模板';
                        }
                    })
                    this.tableData = resp.result;
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
.time-input-box input{
    width: 200px;
    height: 28px;
    line-height: 28px;
    -webkit-appearance: none;
    background-color: #fff;
    background-image: none;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    box-sizing: border-box;
    display: inline-block;
    font-size: inherit;
    outline: none;
    padding: 0 8px;
    transition: border-color .2s cubic-bezier(.645,.045,.355,1);
}
.time-input-box input:focus {
    outline: none;
    border-color: #409eff;
}
.time-input-box span{
    font-weight: 700;
}
</style>
