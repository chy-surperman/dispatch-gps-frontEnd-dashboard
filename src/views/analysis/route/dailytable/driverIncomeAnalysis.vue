<template>
    <el-card shadow="always">
        <div slot="header" class="clearfix">
            <span v-text="title"></span>
        </div>
        <v-chart :options="orderDriverRevenue" width="100%" height="470px" listenDownload="200"></v-chart>
        <v-chart :options="driverTripRevenAndRuntime" width="100%" height="350px" listenDownload="200"></v-chart>
        <v-chart :options="revenueTripDistributed" width="100%" height="350px" listenDownload="200"></v-chart>
    </el-card>
</template>

<script>

import vChart from '@/components/echarts/vChart'
import {REQ_SUCCESS,baseURL} from '@/utils/APIConstans'
import {getDriverRevenue100kmOrder} from '@/api/analysis'
import {getDriverTripRevenAndRuntime,getDriverRevenueTripDistributed} from '@/api/routeAnalysis'

export default {
    name: 'routeDailyTripAnalysis',
    components: {
        'v-chart': vChart
    },
    data(){
        return {
            orderDriverRevenue:{
                title: {
                    text: '驾驶员百公里收入对比'
                },
                grid:{
                    left:100,
                    top:'30%'
                },
                legend: {top:'15%'},
                tooltip: {},
                dataset: {
                    // 提供一份数据。
                    dimensions: [
                        {name: 'driverName',displayName:'司机',type:'ordinal'},
                        {name: 'revenuePer100km',displayName:'百公里收入',type:'float'},
                    ],
                    source:[]
                },
                // 声明一个 X 轴，类目轴（category）。默认情况下，类目轴对应到 dataset 第一列。
                xAxis: {},
                // 声明一个 Y 轴，数值轴。
                yAxis: {type: 'category'},
                // 声明多个 bar 系列，默认情况下，每个系列会自动对应到 dataset 的每一列。
                series: [
                    {type: 'bar'},
                ],
                dataZoom:[
                    {
                        type: 'slider',
                        xAxisIndex: [0],
                    },
                    {
                        type: 'slider',
                        yAxisIndex: [0],
                    }
                ]
            },
            driverTripRevenAndRuntime:{
                title: {
                    text: '驾驶员载客收入与运营时长对比'
                },
                grid:{
                    left:0,
                    top:'30%'
                },
                legend: {top:'15%'},
                tooltip: {},
                dataset: {
                    // 提供一份数据。
                    dimensions: [
                        {name: 'driverName',displayName:'驾驶员',type:'ordinal'},
                        {name: 'driverRevenue',displayName:'趟收入',type:'float'},
                        {name: 'runningTime',displayName:'运营时长',type:'float'}
                    ],
                    source: []
                },
                // 声明一个 X 轴，类目轴（category）。默认情况下，类目轴对应到 dataset 第一列。
                xAxis: {type: 'category'},
                // 声明一个 Y 轴，数值轴。
                yAxis: {},
                // 声明多个 bar 系列，默认情况下，每个系列会自动对应到 dataset 的每一列。
                series: [
                    {type: 'bar'},
                    {type: 'bar'}
                ]
            },
            revenueTripDistributed:{
                title: {
                    text: '驾驶员载客收入与各时间段趟次对比'
                },
                grid:{
                    left:0,
                    top:'30%'
                },
                legend: {top:'15%'},
                tooltip: {},
                dataset: {
                    // 提供一份数据。
                    dimensions: [],
                    source: []
                },
                // 声明一个 X 轴，类目轴（category）。默认情况下，类目轴对应到 dataset 第一列。
                xAxis: {type: 'category'},
                // 声明一个 Y 轴，数值轴。
                yAxis: {},
                // 声明多个 bar 系列，默认情况下，每个系列会自动对应到 dataset 的每一列。
                series: [
                    {type: 'bar'},
                    {type: 'bar'}
                ]
            },
        }
    },
    created(){
        this.listenQueryChangeEvent();
    },
    computed:{
        queryForm(){
            let queryForm = this.$store.state.routeDailytable.query;
            return queryForm;
        },
        title(){
            return this.queryForm.routeName + '线' + this.queryForm.workdate + '日营收分析'
        }
    },
    methods:{
        listenQueryChangeEvent(){
            this.$EventBus.$on('route_daily_table_query_change',(event) => {
                this._getDriverRevenue100kmOrder();
                this._getDriverTripRevenAndRuntime();
                this._getDriverRevenueTripDistributed();
            });
        },
        _getDriverRevenue100kmOrder(){
            let params = {
                routeName:this.queryForm.routeName,
                startDate:this.queryForm.workdate,
                endDate:this.queryForm.workdate
            }
            getDriverRevenue100kmOrder(params).then(resp => {
                const {code,result} = resp;
                if(code == REQ_SUCCESS){
                    this.orderDriverRevenue = {
                        dataset: {
                            source: result
                        },
                        dataZoom:[{xAxisIndex:[0]}]
                    }
                }
            })
        },
        
        _getDriverTripRevenAndRuntime(){
            getDriverTripRevenAndRuntime(this.queryForm).then(resp => {
                if(resp.code == REQ_SUCCESS){
                    this.driverTripRevenAndRuntime = {
                        dataset: {
                            source: resp.result
                        },
                        dataZoom:[{xAxisIndex:[0]}]
                    }
                }
            });
        },

        _getDriverRevenueTripDistributed(){
            getDriverRevenueTripDistributed(this.queryForm).then(resp => {
                if(resp.code == REQ_SUCCESS){
                    this.handleRevenueTripDistributedDataset(resp.result);
                }
            });
        },
        handleRevenueTripDistributedDataset(result){
            if(result == undefined || result.length <= 0){
                return;
            }
            result.forEach(ele => {
                let total = 0;
                for(let p in ele){
                    if(p != 'driverName' && p != 'driverRevenue'){
                        total += ele[p];
                    }
                }
                for(let p in ele){
                    if(p != 'driverName' && p != 'driverRevenue'){
                        ele[p] = (ele[p] / total) * ele.driverRevenue;
                    }
                }
            })
            //维度
            let dimensions = [{name: 'driverName',displayName:'驾驶员',type:'ordinal'}];
            let firstRow = result[0];
            for(let p in firstRow){
                if(p != 'driverName' && p != 'driverRevenue'){
                    dimensions.push({name: p,displayName:p,type:'float'})
                }
            }

            //系列
            let series = []
            for(let p in firstRow){
                if(p != 'driverName' && p != 'driverRevenue'){
                    series.push({
                        type:'bar',
                        name:p,
                        stack:'趟次'
                    })
                }
            }
            this.revenueTripDistributed = {
                dataset: {
                    dimensions,
                    source: result
                },
                series,
                dataZoom:[{xAxisIndex:[0]}]
            }
        }
    }
}
</script>