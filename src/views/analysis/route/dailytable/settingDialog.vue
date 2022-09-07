<template>
    <el-dialog title="查询条件" width="20%" :visible.sync="dialogFormVisible">
        <el-form :model="select">
            <el-form-item label="大队" :label-width="formLabelWidth">
                <el-select size="small" v-model="select.groupName" @change="groupNameChange" placeholder="请选择大队">
                    <el-option v-for="groupName in routeGroups" :key="groupName" :label="groupName" :value="groupName"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="线路" :label-width="formLabelWidth">
                <el-select size="mini" v-model="select.routeName" placeholder="请选择线路">
                    <el-option v-for="routeName in routeList" :key="routeName" :label="routeName" :value="routeName"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="日期" :label-width="formLabelWidth">
                <el-date-picker size="mini" v-model="select.workdate" type="date" value-format="yyyy-MM-dd" placeholder="选择日期"></el-date-picker>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="closeDialog">取 消</el-button>
            <el-button type="primary" @click="queryChange">确 定</el-button>
        </div>
    </el-dialog>
</template>

<script>
import {REQ_SUCCESS,baseURL} from '@/utils/APIConstans'
import {getRouteGroup,getRouteNames} from '@/api/common'
export default {
    name:'settingDailytableDialog',
    data(){
        return {
            formLabelWidth:'40px',
            routeList:[],
            routeGroups:[],
            select:{
                groupName:'',
                workdate:'',
                routeName:''
            },
        }
    },
    created(){
        this._getRouteGroup();
    },
    computed:{
        dialogFormVisible(){
            return this.$store.state.routeDailytable.showQueryDialog;
        }
    },
    methods:{
        _getRouteNames(groupName){
            getRouteNames({groupName}).then(resp => {
                if(resp.code == REQ_SUCCESS){
                    this.routeList = resp.result;
                }
            })
        },
        _getRouteGroup(){
            getRouteGroup().then(resp => {
                if(resp.code == REQ_SUCCESS){
                    this.routeGroups = resp.result;
                }
            });
        },
        groupNameChange(){
            this._getRouteNames(this.select.groupName);
        },
        queryChange(){
            this.$store.commit('routeDailytable/CHANGE_QUERY',this.select);
            this.$EventBus.$emit('route_daily_table_query_change',this.select);
            this.closeDialog();
        },
        closeDialog(){
            this.$store.dispatch('routeDailytable/showRouteDailyTableDialog',false);
        }
    },
}
</script>