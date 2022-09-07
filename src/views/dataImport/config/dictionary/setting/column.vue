<template>
    <div>
        <el-dialog title="设置字典字段" width="80%" :modal="true" :show-close="false" 
                   :close-on-click-modal="false" center :visible.sync="dialogColTableVisible">
           <el-button size="small" type="primary" @click="addDictionaryCol"><i class="el-icon-plus"></i>添加字段</el-button>
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
                <el-table-column prop="columnLabel" label="字典字段名">
                    <template slot-scope="scope">
                        <span v-if="!scope.row.isEdit" v-text="scope.row.columnLabel"></span>
                        <div class="time-input-box" v-if="scope.row.isEdit">
                            <input v-model="scope.row.columnLabel" placeholder="请输入字段名"/>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="fieldTypeStr" label="key/value">
                    <template slot-scope="scope">
                        <span v-if="!scope.row.isEdit" v-text="scope.row.fieldTypeStr"></span>
                        <el-select v-if="scope.row.isEdit" placeholder="请选择" v-model="scope.row.fieldType" size="mini">
                            <el-option v-for="item in fieldTypes" :key="item.value" :label="item.label" :value="item.value"></el-option>
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
                            @click="editDictionaryCol(scope.$index, scope.row)">编辑</el-button>
                        <el-button
                            v-if="!scope.row.isEdit"
                            size="mini"
                            type="danger"
                            @click="_deleteDictionaryCol(scope.$index, scope.row)">删除</el-button>
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
import {getDictionaryCols,saveDictionaryCol,deleteDictionaryCol} from '@/api/dictionary'
import { REQ_SUCCESS } from '@/utils/APIConstans'

export default {
    name:'template_column',
    props:["dictionaryId","showDictionaryColDialog"],
    data(){
        return {
            tableData:[],
            dataTypes:["varchar","int","float","double","long","date","datetime"],
            fieldTypes:[{label:"key",value:1},{label:"value",value:2}],
            dialogColTableVisible:false,
        }
    },
    mounted(){
        if(null != this.dictionaryId && this.dictionaryId.length > 0){
            this._getDictionaryCols(this.dictionaryId);
        }
    },
    watch:{
        showDictionaryColDialog(newVal){
            this.dialogColTableVisible = newVal;
            if(this.dialogColTableVisible){
                this._getDictionaryCols(this.dictionaryId);
            }
        },
        dictionaryId(newTemlateId){
            this.dictionaryId = newTemlateId
            this._getDictionaryCols(this.dictionaryId);
        }
    },
    methods:{
        closeDictionaryColDialog(){
            this.$emit('closeDialog');
        },
        addDictionaryCol(){
            let col = {
                columnIndex: this.tableData.length + 1,
                columnName:'',
                columnLabel:'',
                dataType:'',
                fieldType:'',
                fieldTypeStr:'',
                dataLength:'',
                decimalPlaces:'',
                isEdit:true,
                model:"add"
            }
            this.tableData.push(col);
        },
        editDictionaryCol(index,row){
            this.$set(this.tableData[index],"model","edit");
            this.$set(this.tableData[index],"isEdit",true);
        },
        _deleteDictionaryCol(index,row){
            this.$confirm('此操作将永久删除该字段, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let params = {
                        dictionaryId:this.dictionaryId,
                        id:row.id
                    }
                    deleteDictionaryCol(params).then(resp => {
                        if(resp.code == REQ_SUCCESS){
                            this._getDictionaryCols(this.dictionaryId);
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
            row.dictionaryId = this.dictionaryId;
            console.log(saveDictionaryCol)
            saveDictionaryCol(row).then(resp => {
                if(resp.code == REQ_SUCCESS){
                    this.$message.success("保存成功");
                    this._getDictionaryCols(this.dictionaryId);
                }else{
                    this.$message.error(resp.define);
                }
            })
        },
        cancel(index,row){
            if(row.model == 'add'){
                this.tableData.splice(index,1);
            }else{
                this._getDictionaryCols(this.dictionaryId);
            }
        },
        _getDictionaryCols(dictionaryId){
            let params = {
                dictionaryId
            };
            getDictionaryCols(params).then(resp => {
                if(resp.code == REQ_SUCCESS){
                    resp.result.forEach(ele => {
                        if(ele.fieldType == 1){
                            ele.fieldTypeStr = 'key';
                        }else{
                            ele.fieldTypeStr = 'value';
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