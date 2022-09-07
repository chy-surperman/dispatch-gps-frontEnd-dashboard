<template>
    <el-card shadow="always">
        <div slot="header" class="clearfix">
            <span v-text="title"></span>
        </div>
        <v-chart :options="mileageTripKmRateBar" width="100%" height="350px" listenDownload="200"></v-chart>

        <v-chart :options="mileageBar" width="100%" height="350px" listenDownload="200"></v-chart>
    </el-card>
</template>

<script>

import vChart from '@/components/echarts/vChart'
import {REQ_SUCCESS,baseURL} from '@/utils/APIConstans'
import {getVehicleOperationMileage,getVehicleTipMileageCompared} from '@/api/analysis'

export default {
    name: 'routeDailyTripAnalysis',
    components: {
        'v-chart': vChart
    },
    data(){
        return {
            mileageTripKmRateBar:{
                title: {
                    text: '车辆营运里程与标准趟次里程比'
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
                        {name: 'selfNum',displayName:'车号',type:'ordinal'},
                        {name: 'mileageTripPeer',displayName:'里程趟次比值',type:'float'},
                    ],
                    source: []
                },
                // 声明一个 X 轴，类目轴（category）。默认情况下，类目轴对应到 dataset 第一列。
                xAxis: {type: 'category'},
                // 声明一个 Y 轴，数值轴。
                yAxis: {},
                // 声明多个 bar 系列，默认情况下，每个系列会自动对应到 dataset 的每一列。
                series: [
                    {type: 'bar',markLine:{data:[{type: 'average', name: '平均值'}]}}
                ]
            },
            mileageBar:{
                title: {
                    text: '车辆里程、营运、非营业里程对比'
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
                        {name: 'selfNum',displayName:'车号',type:'ordinal'},
                        {name: 'totalGpsMileage',displayName:'总里程',type:'float'},
                        {name: 'operationMileage',displayName:'营运里程',type:'float'},
                        {name: 'nonOperationMileage',displayName:'非营运里程',type:'float'},
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
            return this.queryForm.routeName + '线' + this.queryForm.workdate + '日里程分析'
        }
    },
    methods:{
        listenQueryChangeEvent(){
            this.$EventBus.$on('route_daily_table_query_change',(event) => {
                this._getMileageBar();
                this._getMileageTripKmRateBar();
            });
        },
        _getMileageBar(){
            let params = {
                routeName:this.queryForm.routeName,
                startDate:this.queryForm.workdate,
                endDate:this.queryForm.workdate
            }
            getVehicleOperationMileage(params).then(resp => {
                const {code,result} = resp;
                if(code == REQ_SUCCESS){
                    let source = [];
                    result.forEach(element => {
                        if(element.totalGpsMileage > 0){
                            source.push(element);
                        }
                    });
                    this.mileageBar = {
                        dataset: {
                            source:source
                        },
                        dataZoom:[{xAxisIndex:[0]}]
                    }
                }
            })
        },
        _getMileageTripKmRateBar(){
            let params = {
                routeName:this.queryForm.routeName,
                startDate:this.queryForm.workdate,
                endDate:this.queryForm.workdate
            }
            getVehicleTipMileageCompared(params).then(resp => {
                const {code,result} = resp;
               
                if(code == REQ_SUCCESS){
                    let source = [];
                    result.forEach(element => {
                        if(element.mileageTripPeer > 0){
                            source.push(element);
                        }
                    });
                    console.log(source);
                    this.mileageTripKmRateBar = {
                        dataset: {
                            source:source
                        },
                        dataZoom:[{xAxisIndex:[0]}]
                    }
                }
            })
        },
    }
}
</script>