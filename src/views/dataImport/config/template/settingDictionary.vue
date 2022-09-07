<template>
    <div>
        <el-dialog title="设置数据字典" width="80%" :modal="true" :show-close="false" 
                   :close-on-click-modal="false" center :visible.sync="dialogDictionaryColTableVisible">
           <el-button size="small" type="primary" @click="addTemplateCol"><i class="el-icon-plus"></i>添加模板字段</el-button>
            <el-table
                :data="tableData"
                border
                size="mini"
                style="width: 100%; margin-top: 20px">
                <el-table-column prop="columnLabel" label="选择字段">
                    <template slot-scope="scope">
                        <span v-if="!scope.row.isEdit" v-text="scope.row.columnLabel"></span>
                        <el-select v-if="scope.row.isEdit" placeholder="请选择" v-model="scope.row.columnName" size="mini">
                            <el-option v-for="item in cols" :key="item.columnName" :label="item.columnLabel" :value="item.columnName"></el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column prop="convertColumnLabel" label="转换字段">
                    <template slot-scope="scope">
                        <span v-if="!scope.row.isEdit" v-text="scope.row.convertColumnLabel"></span>
                        <el-select v-if="scope.row.isEdit" placeholder="请选择" v-model="scope.row.convertColumn" size="mini">
                            <el-option v-for="item in cols" :key="item.columnName" :label="item.columnLabel" :value="item.columnName"></el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column prop="dictionaryName" label="字典表">
                    <template slot-scope="scope">
                        <span v-if="!scope.row.isEdit" v-text="scope.row.dictionaryName"></span>
                        <el-select v-if="scope.row.isEdit" @change="changeDictionaryTable" placeholder="请选择" v-model="scope.row.dictionaryId" size="mini">
                            <el-option v-for="item in dictionaryTables" :key="item.dictionaryId" :label="item.dictionaryName" :value="item.dictionaryId"></el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column prop="dictionaryKeyColLabel" label="字典key">
                    <template slot-scope="scope">
                        <span v-if="!scope.row.isEdit" v-text="scope.row.dictionaryKeyColLabel"></span>
                        <el-select v-if="scope.row.isEdit" placeholder="请选择" v-model="scope.row.dictionaryKeyCol" size="mini">
                            <el-option v-for="item in dictionaryCols" :key="item.columnName" :label="item.columnLabel" :value="item.columnName"></el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column prop="dictionaryValueColLabel" label="字典表Vlue">
                    <template slot-scope="scope">
                        <span v-if="!scope.row.isEdit" v-text="scope.row.dictionaryValueColLabel"></span>
                        <el-select v-if="scope.row.isEdit" placeholder="请选择" v-model="scope.row.dictionaryValueCol" size="mini">
                            <el-option v-for="item in valueCols" :key="item.columnName" :label="item.columnLabel" :value="item.columnName"></el-option>
                        </el-select>
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
                            @click="editTemplateCol(scope.$index, scope.row)">编辑</el-button>
                        <el-button
                            v-if="!scope.row.isEdit"
                            size="mini"
                            type="danger"
                            @click="_deleteTemplateCol(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <span slot="footer" class="dialog-footer">
                <el-button  size="small" @click="closeDictionaryColDialog">取 消</el-button>
                <el-button  type="primary" size="small" @click="closeDictionaryColDialog">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import {getTemplateCols,getExistsDictionaryCols,saveDictionaryCol,removeDictionaryCol} from '@/api/excel'
import {getDictionaryCols,getDictionaryTables} from '@/api/dictionary'
import { REQ_SUCCESS } from '@/utils/APIConstans'

export default {
    name:'template_column',
    props:["templateId","showDictionaryColDialog"],
    data(){
        return {
            tableData:[],
            dictionaryTables:[],
            cols:[],
            keyCols:[],
            valueCols:[],
            dictionaryCols:[],
            dialogDictionaryColTableVisible:false,
        }
    },
    mounted(){
        if(null != this.templateId && this.templateId.length > 0){
            this._getTemplateCols(this.templateId);
        }
    },
    watch:{
        showDictionaryColDialog(newVal){
            this.dialogDictionaryColTableVisible = newVal;
            console.log("showDictionaryColDialog = " + newVal)
            if(this.dialogDictionaryColTableVisible){
                this._getTemplateCols(this.templateId);
                this._getDictionaryTables();
            }
        },
        templateId(newTemlateId){
            this.templateId = newTemlateId;
            this._getExistsDictionaryCols(this.templateId);
            this._getTemplateCols(this.templateId);
            this._getDictionaryTables();
        }
    },
    methods:{
        closeDictionaryColDialog(){
            this.$emit('closeDialog');
        },
        addTemplateCol(){
            let col = {
                columnIndex: this.tableData.length + 1,
                columnName:'',
                columnLabel:'',
                dictionaryName:'',
                dictionaryId:'',
                dictionaryKeyCol:'',
                dictionaryKeyColLabel:'',
                dictionaryValueCol:'',
                dictionaryValueColLabel:'',
                isEdit:true,
                model:"add"
            }
            this.tableData.push(col);
        },
        editTemplateCol(index,row){
            this.$set(this.tableData[index],"model","edit");
            this.$set(this.tableData[index],"isEdit",true);
        },
        _deleteTemplateCol(index,row){
            this.$confirm('此操作将永久删除该模板字段, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let params = {
                        templateId:row.templateId,
                        id:row.id
                    }
                    deleteTemplateCol(params).then(resp => {
                        if(resp.code == REQ_SUCCESS){
                            this._getExistsDictionaryCols(this.templateId);
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
            row.templateId = this.templateId;
            saveDictionaryCol(row).then(resp => {
                if(resp.code == REQ_SUCCESS){
                    this.$message.success("保存成功");
                    this._getExistsDictionaryCols(this.templateId);
                }else{
                    this.$message.error(resp.define);
                }
            })
        },
        cancel(index,row){
            if(row.model == 'add'){
                this.tableData.splice(index,1);
            }else{
                this._getExistsDictionaryCols(this.templateId);
            }
        },
        changeDictionaryTable(val){
            this._getDictionaryCols(val);
        },
        _getExistsDictionaryCols(templateId){
            getExistsDictionaryCols({templateId}).then(resp => {
                const {code,result} = resp;
                if(code == REQ_SUCCESS){
                    this.tableData = result;
                    if(this.tableData.length > 0)
                        this._getDictionaryCols(this.tableData[0].dictionaryId);
                }
            });
        },
        _getTemplateCols(templateId){
            let params = {
                templateId
            };
            getTemplateCols(params).then(resp => {
                if(resp.code == REQ_SUCCESS){
                    this.cols = resp.result;
                }
            });
        },
        _getDictionaryCols(dictionaryId){
            let params = {dictionaryId};
            getDictionaryCols(params).then(resp => {
                const {code,result} = resp;
                if(code == REQ_SUCCESS){
                    let keyCols = [];
                    let valueCols = [];
                    result.forEach(ele => {
                        if(ele.fieldType == 1){
                            keyCols.push(ele);
                        }else{
                            valueCols.push(ele);
                        }
                    });
                    this.dictionaryCols = result;
                    this.keyCols = keyCols;
                    this.valueCols = valueCols;
                }
            })
        },
        _getDictionaryTables(){
            getDictionaryTables().then(resp => {
                if(resp.code == REQ_SUCCESS){
                    this.dictionaryTables = resp.result;
                }
            });
        }
    }
}
</script>

<style lang="scss" scoped>
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