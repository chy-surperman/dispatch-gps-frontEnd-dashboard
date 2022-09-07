<template>
    <div>
        <query-condition isShowGroupName="true" isShowRouteName="true" @query="queryChart"></query-condition>

        <el-row :gutter="20" style="margin:15px;">
            <el-col :span="24">
                <v-chart style="width:100%;" :options="fuel100kmLine"/>
            </el-col>
        </el-row>

        <el-row :gutter="20" style="margin:15px;">
            <el-col :span="12">
                <!-- <v-chart :options="mileageBar"/> -->
                <v-chart :options="mileageBar" width="100%" height="400px"></v-chart>
            </el-col>
            <el-col :span="12">
                <!-- <v-chart :options="mileageTripKmRateBar"/> -->
                <v-chart :options="mileageTripKmRateBar" width="100%" height="400px"></v-chart>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import {REQ_SUCCESS,baseURL} from '@/utils/APIConstans'
    import {getVehicleEnergyCompared,getVehicleEnergyTripCompared} from '@/api/analysis'
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
                mileageTripKmRateBar:{
                    title: {
                        text: '每趟次平均油电/耗'
                    },
                    grid:{
                        left:0,
                        top:'30%'
                    },
                    legend: {top:'15%'},
                    tooltip: {},
                    dataset: {
                        dimensions: [
                            {name: 'selfNum',displayName:'车号',type:'ordinal'},
                            {name: 'perChargeTrip',displayName:'每趟次电耗',type:'float'},
                            {name: 'perRefuelingAmountTrip',displayName:'每趟次油耗',type:'float'}
                        ],
                        // 提供一份数据。
                        source: []
                    },
                    // 声明一个 X 轴，类目轴（category）。默认情况下，类目轴对应到 dataset 第一列。
                    xAxis: {type: 'category'},
                    // 声明一个 Y 轴，数值轴。
                    yAxis: {},
                    // 声明多个 bar 系列，默认情况下，每个系列会自动对应到 dataset 的每一列。
                    series: [
                        {type: 'bar',markLine:{data:[{type: 'average', name: '平均值'}]}},
                        {type: 'bar',markLine:{data:[{type: 'average', name: '平均值'}]}}
                    ]
                },
                mileageBar:{
                    title: {
                        text: '百公里油/电耗'
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
                            {name: 'chargePer100Km',displayName:'百公里电耗',type:'float'},
                            {name: 'puelPer100Km',displayName:'百公里油耗',type:'float'}
                        ],
                        source: []
                    },
                    // 声明一个 X 轴，类目轴（category）。默认情况下，类目轴对应到 dataset 第一列。
                    xAxis: {type: 'category'},
                    // 声明一个 Y 轴，数值轴。
                    yAxis: {},
                    // 声明多个 bar 系列，默认情况下，每个系列会自动对应到 dataset 的每一列。
                    series: [
                        {type: 'bar',markLine:{data:[{type: 'average', name: '平均值'}]}},
                        {type: 'bar',markLine:{data:[{type: 'average', name: '平均值'}]}},
                    ]
                },
                fuel100kmLine:null
            }
        },
        created(){
        },
        methods:{
            queryChart(data){
                this._getMileageTripKmRateBar(data);
                this._getVehicleEnergyCompared(data);
            },
            _getVehicleEnergyCompared(data){
                getVehicleEnergyCompared(data).then(resp => {
                    const {code,result} = resp;
                    if(code == REQ_SUCCESS){
                        this.mileageBar = {
                            dataset: {
                                source: result
                            },
                            dataZoom:[{xAxisIndex:[0]}]
                        }
                    }
                })
            },
            _getMileageTripKmRateBar(data){
                getVehicleEnergyTripCompared(data).then(resp => {
                    const {code,result} = resp;
                    if(code == REQ_SUCCESS){
                        this.mileageTripKmRateBar = {
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

<style lang="scss" scoped>
    .zhi_divider{
        color:#606266;
        width:28px;
        height:28px;
        line-height:28px;
        float:left;
    }
</style>