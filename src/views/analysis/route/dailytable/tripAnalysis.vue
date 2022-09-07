<template>
    <el-card shadow="always">
        <div slot="header" class="clearfix">
            <span v-text="title"></span>
        </div>
        <v-chart :options="allDayTimeTrip" width="100%" height="350px" listenDownload="200"></v-chart>

        <v-chart :options="upBusyIdleTrip" width="100%" height="350px" listenDownload="200"></v-chart>

        <v-chart :options="downBusyIdleTrip" width="100%" height="350px" listenDownload="200"></v-chart>
    </el-card>
</template>

<script>

import vChart from '@/components/echarts/vChart'
import {REQ_SUCCESS,baseURL} from '@/utils/APIConstans'
import {getAllDayTimeTrip,getBusyIdleTrip} from '@/api/routeAnalysis'

export default {
    name: 'routeDailyTripAnalysis',
    components: {
        'v-chart': vChart
    },
    data(){
        return {
            allDayTimeTrip:{
                title: {
                    text: '各时段趟次分布图'
                },
                grid:{
                    left:0,
                    top:'10%'
                },
                legend: {top:'0%'},
                tooltip: {},
                dataset: {
                    // 提供一份数据。
                    dimensions: [
                        {name: 'timeSegment',displayName:'时段',type:'ordinal'},
                        {name: 'upTrip',displayName:'上行趟次数',type:'float'},
                        {name: 'downTrip',displayName:'下行趟次数',type:'float'}
                    ],
                    source: []
                },
                // 声明一个 X 轴，类目轴（category）。默认情况下，类目轴对应到 dataset 第一列。
                xAxis: {type: 'category'},
                // 声明一个 Y 轴，数值轴。
                yAxis: {type: 'value'},
                // 声明多个 bar 系列，默认情况下，每个系列会自动对应到 dataset 的每一列。
                series: [
                    {type: 'bar'},
                    {type: 'bar'}
                ],
                dataZoom:[
                    {
                        type: 'slider',
                        xAxisIndex: [0],
                    }
                ]
            },
            upBusyIdleTrip:{
                title: {
                    text: '上行高平峰趟次分布图'
                },
                grid:{
                    left:0,
                    top:'10%'
                },
                legend: {top:'0%'},
                tooltip: {},
                dataset: {
                    // 提供一份数据。
                    dimensions: [
                        {name: 'timeSegment',displayName:'时段',type:'ordinal'},
                        {name: 'trip',displayName:'趟次数',type:'float'}
                    ],
                    source: []
                },
                // 声明一个 X 轴，类目轴（category）。默认情况下，类目轴对应到 dataset 第一列。
                xAxis: {type: 'category'},
                // 声明一个 Y 轴，数值轴。
                yAxis: {type: 'value'},
                // 声明多个 bar 系列，默认情况下，每个系列会自动对应到 dataset 的每一列。
                series: [
                    {type: 'bar'}
                ],
                dataZoom:[
                    {
                        type: 'slider',
                        xAxisIndex: [0],
                    }
                ]
            },
            downBusyIdleTrip:{
                title: {
                    text: '下行高平峰趟次分布图'
                },
                grid:{
                    left:0,
                    top:'10%'
                },
                legend: {top:'0%'},
                tooltip: {},
                dataset: {
                    // 提供一份数据。
                    dimensions: [
                        {name: 'timeSegment',displayName:'时段',type:'ordinal'},
                        {name: 'trip',displayName:'趟次数',type:'float'}
                    ],
                    source: []
                },
                // 声明一个 X 轴，类目轴（category）。默认情况下，类目轴对应到 dataset 第一列。
                xAxis: {type: 'category'},
                // 声明一个 Y 轴，数值轴。
                yAxis: {type: 'value'},
                // 声明多个 bar 系列，默认情况下，每个系列会自动对应到 dataset 的每一列。
                series: [
                    {type: 'bar'}
                ],
                dataZoom:[
                    {
                        type: 'slider',
                        xAxisIndex: [0],
                    }
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
            return this.queryForm.routeName + '线' + this.queryForm.workdate + '日趟次分析'
        }
    },
    methods:{
        listenQueryChangeEvent(){
            this.$EventBus.$on('route_daily_table_query_change',(event) => {
                this._getAllDayTimeTrip();
                this._getUpBusyIdleTrip();
                this._getDownBusyIdleTrip();
            });
        },
        _getUpBusyIdleTrip(){
            let params = {
                ...this.queryForm,
                starttag:'0'
            };
            getBusyIdleTrip(params).then(resp => {
                if(resp.code == REQ_SUCCESS){
                    this.upBusyIdleTrip = {
                        dataset: {
                            source: resp.result
                        },
                        dataZoom:[{xAxisIndex:[0]}]
                    }
                }
            });
        },
        _getDownBusyIdleTrip(){
            let params = {
                ...this.queryForm,
                starttag:'1'
            };
            getBusyIdleTrip(params).then(resp => {
                if(resp.code == REQ_SUCCESS){
                    this.downBusyIdleTrip = {
                        dataset: {
                            source: resp.result
                        },
                        dataZoom:[{xAxisIndex:[0]}]
                    }
                }
            });
        },
        _getAllDayTimeTrip(){
            getAllDayTimeTrip(this.queryForm).then(resp => {
                if(resp.code == REQ_SUCCESS){
                    this.allDayTimeTrip = {
                        dataset: {
                            source: resp.result
                        },
                        dataZoom:[{xAxisIndex:[0]}]
                    }
                }
            });
        }
    }
}
</script>

<style scoped>
</style>
