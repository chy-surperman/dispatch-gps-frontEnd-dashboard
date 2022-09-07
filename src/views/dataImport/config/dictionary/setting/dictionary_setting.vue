<template>
    <div class="dashboard-container">
        <el-row>
            <el-col :span="3">
                <el-button type="primary" @click="addDictionary"><i class="el-icon-plus"></i>添加模板</el-button>
            </el-col>
        </el-row>
        <el-row>
             <el-table
                :data="tableData"
                border
                size="mini"
                style="width: 100%; margin-top: 20px">
                <el-table-column
                    prop="dictionaryName"
                    label="字典名称">
                    <template slot-scope="scope">
                        <span v-if="!scope.row.isEdit" v-text="scope.row.dictionaryName"></span>
                        <div class="time-input-box" v-if="scope.row.isEdit">
                            <input v-model="scope.row.dictionaryName" placeholder="请输入字典表名称"/>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="tableName"
                    label="表名称">
                    <template slot-scope="scope">
                        <span v-if="!scope.row.isEdit" v-text="scope.row.tableName"></span>
                        <div class="time-input-box" v-if="scope.row.isEdit">
                            <input v-model="scope.row.tableName" placeholder="请输入字典表名"/>
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
                            @click="editDictionary(scope.$index, scope.row)">编辑</el-button>
                        <el-button
                            size="mini"
                            type="primary"
                            v-if="!scope.row.isEdit"
                            @click="editDictionaryCol(scope.$index, scope.row)">编辑字段</el-button>
                        <el-button
                            v-if="!scope.row.isEdit"
                            size="mini"
                            type="danger"
                            @click="_deleteDictionary(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-row>
        <dictionaryCol 
            :dictionaryId="editeDictionaryId" 
            :showDictionaryColDialog="showDictionaryColDialog"
            @closeDialog="closeDictionaryColDialog"> </dictionaryCol>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {getDictionaryTables,saveDictionaryTable,deleteDictionaryTable} from '@/api/dictionary'
import { REQ_SUCCESS } from '@/utils/APIConstans'
import dictionaryCol from './column'

export default {
    name: 'dictionary_setting',
    components:{
        dictionaryCol
    },
    data() {
        return {
            tableData:[],
            showDictionaryColDialog:false,
            editeDictionaryId:''
        }
    },
    mounted(){
        this._getDictionary();
    },
    methods:{
        addDictionary(){
            let template = {
                dictionaryName:'',
                tableName:'',
                isEdit:true,
                model:'add'
            }
            this.tableData.push(template);
        },
        editDictionary(index,row){
            this.$set(this.tableData[index],"model","edit");
            this.$set(this.tableData[index],"isEdit",true);
        },
        _deleteDictionary(index,row){
            this.$confirm('此操作将永久删除该字典表, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let params = {
                        dictionaryId:row.dictionaryId
                    }
                    deleteDictionaryTable(params).then(resp => {
                        if(resp.code == REQ_SUCCESS){
                            this._getDictionary();
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
            saveDictionaryTable(row).then(resp => {
                if(resp.code == REQ_SUCCESS){
                    this.$message.success("保存成功");
                    this._getDictionary();
                }else{
                    this.$message.error(resp.define);
                }
            })
        },
        cancel(index,row){
            if(row.model == 'add'){
                this.tableData.splice(index,1);
            }else{
                this._getDictionary();
            }
        },
        editDictionaryCol(index,row){
            this.editeDictionaryId = row.dictionaryId;
            this.showDictionaryColDialog = true;
        },
        closeDictionaryColDialog(){
            this.showDictionaryColDialog = false;
        },
        _getDictionary(){
            getDictionaryTables().then(resp => {
                if(resp.code == REQ_SUCCESS){
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
