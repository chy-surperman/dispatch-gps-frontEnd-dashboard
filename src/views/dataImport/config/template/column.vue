<template>
    <div>
        <el-dialog title="设置模板字段" width="80%" :modal="true" :show-close="false" 
                   :close-on-click-modal="false" center :visible.sync="dialogTemplateColTableVisible">
           <el-button size="small" type="primary" @click="addTemplateCol"><i class="el-icon-plus"></i>添加模板字段</el-button>
            <el-table
                :data="tableData"
                border
                size="mini"
                style="width: 100%; margin-top: 20px">
                <el-table-column prop="columnIndex" label="字段顺序">
                    <template slot-scope="scope">
                        <span v-if="!scope.row.isEdit" v-text="scope.row.columnIndex"></span>
                        <el-input-number  v-if="scope.row.isEdit" size="mini" v-model="scope.row.columnIndex" :min="1" :max="30" label="字段顺序"></el-input-number>
                    </template>
                </el-table-column>
                <el-table-column prop="columnLabel" label="模板字段名">
                    <template slot-scope="scope">
                        <span v-if="!scope.row.isEdit" v-text="scope.row.columnLabel"></span>
                        <div class="time-input-box" v-if="scope.row.isEdit">
                            <input v-model="scope.row.columnLabel" placeholder="请输入字段名"/>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="columnCategory" label="字段类别">
                    <template slot-scope="scope">
                        <span v-if="!scope.row.isEdit" v-text="scope.row.columnCategory"></span>
                        <el-select v-if="scope.row.isEdit" placeholder="请选择" v-model="scope.row.columnCategory" size="mini">
                            <el-option v-for="item in columnCategorys" :key="item" :label="item" :value="item"></el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column prop="columnName" label="表字段名">
                    <template slot-scope="scope">
                        <span v-if="!scope.row.isEdit" v-text="scope.row.columnName"></span>
                        <div class="time-input-box" v-if="scope.row.isEdit">
                            <input v-model="scope.row.columnName" placeholder="请输入表字段名"/>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="dataType" label="表字段类型">
                    <template slot-scope="scope">
                        <span v-if="!scope.row.isEdit" v-text="scope.row.dataType"></span>
                        <el-select v-if="scope.row.isEdit" placeholder="请选择" v-model="scope.row.dataType" size="mini">
                            <el-option v-for="item in dataTypes" :key="item" :label="item" :value="item"></el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column prop="dataLength" label="表字段长度">
                    <template slot-scope="scope">
                        <span v-if="!scope.row.isEdit" v-text="scope.row.dataLength"></span>
                        <el-input-number  size="mini" v-if="scope.row.isEdit" v-model="scope.row.dataLength" :min="10" :max="255" label="表字段长度"></el-input-number>
                    </template>
                </el-table-column>
                <el-table-column prop="decimalPlaces" label="小数点位长度">
                    <template slot-scope="scope">
                        <span v-if="!scope.row.isEdit" v-text="scope.row.decimalPlaces"></span>
                        <el-input-number  size="mini" v-if="scope.row.isEdit" v-model="scope.row.decimalPlaces" :min="0" :max="255" label="小数点位长度"></el-input-number>
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
                <el-button  size="small" @click="closeTemplateColDialog">取 消</el-button>
                <el-button  type="primary" size="small" @click="closeTemplateColDialog">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import {getTemplateCols,saveTemplateCol,deleteTemplateCol} from '@/api/excel'
import { REQ_SUCCESS } from '@/utils/APIConstans'

export default {
    name:'template_column',
    props:["templateId","showTemplateColDialog"],
    data(){
        return {
            tableData:[],
            dataTypes:["varchar","int","float","double","long","date","datetime"],
            columnCategorys:["revenue","passengerFlow","join","cash",'normal'],
            dialogTemplateColTableVisible:false,
        }
    },
    mounted(){
        if(null != this.templateId && this.templateId.length > 0){
            this._getTemplateCols(this.templateId);
        }
    },
    watch:{
        showTemplateColDialog(newVal){
            this.dialogTemplateColTableVisible = newVal;
            if(this.dialogTemplateColTableVisible){
                this._getTemplateCols(this.templateId);
            }
        },
        templateId(newTemlateId){
            this.templateId = newTemlateId
            this._getTemplateCols(this.templateId);
        }
    },
    methods:{
        closeTemplateColDialog(){
            this.$emit('closeDialog');
        },
        addTemplateCol(){
            let col = {
                columnIndex: this.tableData.length + 1,
                columnName:'',
                columnLabel:'',
                dataType:'',
                columnCategory:'',
                dataLength:'',
                decimalPlaces:'',
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
                            this._getTemplateCols(this.templateId);
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
            saveTemplateCol(row).then(resp => {
                if(resp.code == REQ_SUCCESS){
                    this.$message.success("保存成功");
                    this._getTemplateCols(this.templateId);
                }else{
                    this.$message.error(resp.define);
                }
            })
        },
        cancel(index,row){
            if(row.model == 'add'){
                this.tableData.splice(index,1);
            }else{
                this._getTemplateCols(this.templateId);
            }
        },
        _getTemplateCols(templateId){
            let params = {
                templateId
            };
            getTemplateCols(params).then(resp => {
                if(resp.code == REQ_SUCCESS){
                    this.tableData = resp.result;
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