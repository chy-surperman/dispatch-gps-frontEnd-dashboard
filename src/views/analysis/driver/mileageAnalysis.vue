<template>
    <div>
        <query-condition isShowGroupName="true" isShowRouteName="true" @query="queryChart"></query-condition>

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
    import {getDriverOperationMileage,getDriverTipMileageCompared} from '@/api/analysis'
    import vChart from '@/components/echarts/vChart'
    import queryCondition from '@/components/QueryCondition/index'

    export default {
        components: {
            'v-chart': vChart,
            'query-condition': queryCondition
        },
        name:'mileageAnalysis',
        data(){
            return {
                mileageTripKmRateBar:{
                    title: {
                        text: '驾驶员营运里程与标准趟次里程比'
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
                            {name: 'mileageTripRate',displayName:'里程趟次比值',type:'float'},
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
                    ]
                },
                mileageBar:{
                    title: {
                        text: '驾驶员营运、非营业里程对比'
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
                        {type: 'bar'}
                    ]
                },
                
            }
        },
        created(){
        },
        methods:{
            queryChart(data){
                this._getMileageBar(data);
                this._getMileageTripKmRateBar(data);
            },
            _getMileageBar(data){
                getDriverOperationMileage(data).then(resp => {
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
                getDriverTipMileageCompared(data).then(resp => {
                    const {code,result} = resp;
                    if(code == REQ_SUCCESS){
                        this.mileageTripKmRateBar = {
                            dataset: {
                                source: result
                            },
                            dataZoom:[{xAxisIndex:[0]}]
                        }
                        console.log(this.mileageTripKmRateBar)
                    }
                })
            },
        }
    }
</script>