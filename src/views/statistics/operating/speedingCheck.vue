<template>
    <div class="schedule-wrap">
        <el-row class="schedule-panel">
            <el-row :gutter="20">
                <el-col :span="3">
                    <el-select size="mini" v-model="select.groupName" @change="groupNameChange" placeholder="请选择大队">
                        <el-option v-for="groupName in routeGroups" :key="groupName" :label="groupName" :value="groupName"></el-option>
                    </el-select>
                </el-col>

                <el-col :span="3">
                    <el-select size="mini" v-model="select.routeName" placeholder="请选择线路">
                        <el-option v-for="routeName in routeList" :key="routeName" :label="routeName" :value="routeName"></el-option>
                    </el-select>
                </el-col>

                <el-col :span="4">
                    <el-date-picker size="mini" v-model="select.workdate" type="date" value-format="yyyy-MM-dd" placeholder="选择日期"></el-date-picker>
                </el-col>

                <el-col :span="2">
                    <el-button type="primary" size="mini" @click="_getSpeedingDriver">查询</el-button>
                </el-col>
            </el-row>

            <el-table max-height="500" v-loading="loading" size="medium" :data="dataTables" align="center" highlight-current-row style="width: 100%">
                <el-table-column align="center" type="index" width="50"></el-table-column>
                <el-table-column align="center" prop="date" label="日期" width="100"></el-table-column>
                <el-table-column align="center" prop="selfNum" label="车号" width="80"></el-table-column>
                <el-table-column align="center" prop="driverName" label="司机姓名" width="100"></el-table-column>
                <el-table-column align="center" prop="driverId" label="司机编号" width="80"></el-table-column>
                <el-table-column align="center" prop="plateNum" label="车牌号" width="100"></el-table-column>
                <el-table-column align="center" prop="routeName" label="线路名" width="100"></el-table-column>
                <el-table-column align="center" prop="startTime" label="超速开始点" width="180"></el-table-column>
                <el-table-column align="center" prop="endTime" label="超速结束点" width="180"></el-table-column>
                <el-table-column align="center" prop="maxSpeed" label="最大速度" width="100"></el-table-column>
                <el-table-column align="center" prop="minSpeed" label="最小速度" width="100"></el-table-column>
                <el-table-column align="center" prop="avgSpeed" label="平均速度" width="100"></el-table-column>
            </el-table>
        </el-row>
    </div>
</template>
<script>
import {getRouteGroup,getRouteNames} from '@/api/common'
import {getDailyReport,getSpeedingDriver} from '@/api/statistics'
import axios from 'axios'
import { getToken } from '@/utils/auth'
import {REQ_SUCCESS,baseURL} from '@/utils/APIConstans'
export default{
    name:"statistics-workplan-driver",
    data(){
        return {
            routeList:[],
            routeGroups:[],
            select:{
                groupName:'',
                workdate:'',
                routeName:''
            },
            dataTables:[],
            loading:false,
            days:[]
        }
    },
    methods:{
        _getRouteNames(groupName){
            this.loading = true;
            getRouteNames({groupName}).then(resp => {
                this.loading = false;
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
        _getSpeedingDriver(){
            getSpeedingDriver(this.select).then(resp => {
                console.log(resp)
                if(resp.code == REQ_SUCCESS){
                    console.log(resp)
                    this.dataTables = resp.result;
                }
            });
        },
        groupNameChange(val){
            this.select.groupName = val;
            this._getRouteNames(val);
        }
    },
    created(){
        this._getRouteGroup();
    }
}
</script>

<style scoped>
    .schedule-wrap{
        height: 99%;
        background: #fff;
    }
    .schedule-header{
        padding-top: 10px;
        padding-left: 20px;
    }
    .meta-panel{
        padding: 20px 10px 0 10px;
    }
    .grid-content {
        margin-top: 10px;
        border-radius: 4px;
    }
    .schedule-panel {
        margin: 15px;
    }
</style>
