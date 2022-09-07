<template>
    <div>
        <query-condition isShowGroupName="true" isShowRouteName="true" @query="queryChart"></query-condition>

        <el-row :gutter="20" style="margin:15px;">
            <el-col :span="12">
                <!-- <v-chart :options="mileageBar"/> -->
                <v-chart :options="order100kmEnergy" width="100%" height="400px"></v-chart>
            </el-col>
            <el-col :span="12">
                <!-- <v-chart :options="mileageTripKmRateBar"/> -->
                <v-chart :options="energyTripRateBar" width="100%" height="400px"></v-chart>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import {REQ_SUCCESS,baseURL} from '@/utils/APIConstans'
    import {getDriverEnergyCompared,getDriverEnergyTripCompared} from '@/api/analysis'
    import vChart from '@/components/echarts/vChart'
    import queryCondition from '@/components/QueryCondition/index'

    export default {
        components: {
            'v-chart': vChart,
            'query-condition': queryCondition
        },
        name:'fuelAnalysis',
        data(){
            return {
                energyTripRateBar:{
                    title: {
                        text: '驾驶员每趟次平均油电/耗'
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
                            {name: 'chargeTripRate',displayName:'每趟次电耗',type:'float'},
                            {name: 'fuelTripRate',displayName:'每趟次油耗',type:'float'}
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
                    ]
                },
                order100kmEnergy:{
                    title: {
                        text: '驾驶员百公里油/电耗排名'
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
                            {name: 'chargePer100km',displayName:'百公里电耗',type:'float'},
                            {name: 'fuelPer100km',displayName:'百公里油耗',type:'float'}
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
                    ]
                }
            }
        },
        methods:{
            queryChart(data){
                this._get100kmEnergyOrderBar(data);
                this._getEnergyTripRateBar(data);
            },
            _get100kmEnergyOrderBar(data){
                getDriverEnergyCompared(data).then(resp => {
                    const {code,result} = resp;
                    if(code == REQ_SUCCESS){
                        this.order100kmEnergy = {
                            dataset: {
                                source: result
                            },
                            dataZoom:[{xAxisIndex:[0]}]
                        }
                    }
                })
            },
            _getEnergyTripRateBar(data){
                getDriverEnergyTripCompared(data).then(resp => {
                    const {code,result} = resp;
                    if(code == REQ_SUCCESS){
                        this.energyTripRateBar = {
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