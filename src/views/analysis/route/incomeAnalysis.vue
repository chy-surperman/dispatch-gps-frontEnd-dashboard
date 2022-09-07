<template>
    <div class="dashboard-container">
        <el-tabs v-model="activeName">
            <el-tab-pane label="线路营收" name="first">
                <query-condition isShowGroupName="true" isShowRouteName="true" @query="queryChart"></query-condition>

                <el-row :gutter="20" style="margin:15px;">
                    <el-col :span="24">
                        <!-- <v-chart style="width:100%;" :options="mileageBar"/> -->
                        <v-chart :options="mileageBar" width="100%" height="400px"></v-chart>
                    </el-col>
                </el-row>
            </el-tab-pane>
            <el-tab-pane label="车队营收" name="second">
                <query-condition isShowGroupName="true" @query="queryRouteTripChart"></query-condition>

                <el-row :gutter="20">
                    <el-col :span="24" style="margin-top:15px;">
                        <!-- <v-chart class="groupEcharts" :options="mileageTripKmRateBar"/> -->
                        <v-chart :options="mileageTripKmRateBar" width="1000px" height="400px"></v-chart>
                    </el-col>
                </el-row>
            </el-tab-pane>
        </el-tabs>
        
    </div>
</template>

<script>
    import {REQ_SUCCESS,baseURL} from '@/utils/APIConstans'
    import {getRouteRevenuePersonLine,getRouteTripAvgRevenue} from '@/api/analysis'
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
                activeName:"first",
                mileageTripKmRateBar:{
                    title: {
                        text: '线路每趟次平均收入'
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
                            {name: 'routeName',displayName:'线路',type:'ordinal'},
                            {name: 'revenueTripRate',displayName:'线路趟次营收',type:'float'}
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
                mileageBar:{
                    title: {
                        text: '线路营收与客流量趋势图'
                    },
                    grid:{
                        left:50,
                        top:'20%'
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    dataset:{
                        dimensions: [
                            {name: 'date',displayName:'时间',type:'ordinal'},
                            {name: 'totalRevenue',displayName:'营收',type:'float'},
                            {name: 'totalPersonflowCount',displayName:'客流量',type:'float'}
                        ],
                        source:[]
                    },
                    legend: {},
                    xAxis:{type: 'category'},
                    yAxis:{},
                    calculable: true,
                    series: [
                        {name:'营收',type:'line',encode:{x:'date',y:'totalRevenue'},markLine:{data:[{type: 'average', name: '平均值'}]}},
                        {name:'客流量',type:'line',encode:{x:'date',y:'totalPersonflowCount'},markLine:{data:[{type: 'average', name: '平均值'}]}}
                    ],
                    animationDuration: 1000
                },
            }
        },
        methods:{
            queryChart(data){
                this._getMileageBar(data);
            },
            queryRouteTripChart(data){
                this._getMileageTripKmRateBar(data);
            },
            _getMileageBar(data){
                getRouteRevenuePersonLine(data).then(resp => {
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
                getRouteTripAvgRevenue(data).then(resp => {
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
.dashboard {
    &-container {
        margin: 30px;
    }
    &-text {
        font-size: 30px;
        line-height: 46px;
    }
}
.groupEcharts {
  width: 1110px;
  height: 400px;
  margin: 0 auto;
}
</style>