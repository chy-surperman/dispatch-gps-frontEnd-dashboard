<template>
    <div>
        <query-condition isShowGroupName="true" isShowRouteName="true" @query="queryChart"></query-condition>
        <el-row :gutter="20" style="margin:15px;">
            <el-col :span="12">
                <!-- <v-chart :options="mileageBar"/> -->
                <v-chart :options="orderDriverRevenue" width="100%" height="400px"></v-chart>
            </el-col>
            <el-col :span="12">
                <!-- <v-chart :options="mileageTripKmRateBar"/> -->
                <v-chart :options="revenueTripRateBar" width="100%" height="400px"></v-chart>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import {REQ_SUCCESS,baseURL} from '@/utils/APIConstans'
    import {getDriverRevenue100kmOrder,getDriverRevenueTripCompared} from '@/api/analysis'
    import vChart from '@/components/echarts/vChart'
    import queryCondition from '@/components/QueryCondition/index'

    export default {
        components: {
            'v-chart': vChart,
            'query-condition': queryCondition
        },
        name:'incomeAnalysis',
        data(){
            return {
                revenueTripRateBar:{
                    title: {
                        text: '驾驶员每趟次平均收入'
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
                            {name: 'driverName',displayName:'司机',type:'ordinal'},
                            {name: 'revenueTripRate',displayName:'每趟次收入',type:'float'}
                        ],
                        source: []
                    },
                    // 声明一个 X 轴，类目轴（category）。默认情况下，类目轴对应到 dataset 第一列。
                    xAxis: {type: 'category'},
                    // 声明一个 Y 轴，数值轴。
                    yAxis: {},
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
                orderDriverRevenue:{
                    title: {
                        text: '驾驶员营收排名'
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
                }
            }
        },
        methods:{
            queryChart(data){
                this._getDriverRevenue100kmOrder(data);
                this._getDriverRevenueTripCompared(data);
            },
            _getDriverRevenue100kmOrder(data){
                getDriverRevenue100kmOrder(data).then(resp => {
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
            _getDriverRevenueTripCompared(data){
                getDriverRevenueTripCompared(data).then(resp => {
                    const {code,result} = resp;
                    if(code == REQ_SUCCESS){
                        this.revenueTripRateBar = {
                            dataset: {
                                source: result
                            },
                            dataZoom:[{xAxisIndex:[0]}]
                        }
                    }
                })
            },
        }
    }
</script>