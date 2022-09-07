<template>
    <div>
        <el-row :gutter="20" style="margin:15px;">
            <el-col :span="3">
                <el-select size="mini" v-model="select.groupName" @change="groupNameChange" placeholder="请选择大队">
                    <el-option v-for="groupName in routeGroups" :key="groupName" :label="groupName" :value="groupName"></el-option>
                </el-select>
            </el-col>

            <el-col :span="9">
                <el-date-picker size="mini" v-model="select.workdate" type="daterange" :picker-options="pickerOptions" 
                        range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" align="right"></el-date-picker>
            </el-col>

            <el-col :span="2">
                <el-button type="primary" size="mini" @click="_getEconomicMoththlyReport">查询</el-button>
            </el-col>
        </el-row>

        <el-row :gutter="20" style="margin:15px;">
            <el-col :span="12">
                <!-- <v-chart :options="mileageBar"/> -->
                <v-chart :options="mileageBar" width="100%" height="400px"></v-chart>
            </el-col>
            <el-col :span="12">
                <!-- <v-chart :options="pieData"/> -->
                <v-chart :options="pieData" width="100%" height="400px"></v-chart>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import {REQ_SUCCESS,baseURL} from '@/utils/APIConstans'
    import {getPieData,getRadarData} from '@/api/analysis'
    import {getRouteGroup,getRouteNames} from '@/api/common'
    import vChart from '@/components/echarts/vChart'

    export default {
        components: {
            'v-chart': vChart
        },
        name:'safetyAnalysis',
        data(){
            return {
                routeList:[],
                routeGroups:[],
                select:{
                    groupName:'',
                    workdate:'',
                    routeName:''
                },
                mileageTripKmRateBar:null,
                mileageBar:null,
                pickerOptions: {
                    shortcuts: [{
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近三个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                },
            }
        },
        created(){
            this._getMileageBar();
            this._getMileageTripKmRateBar();
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
            groupNameChange(val){
                this.select.groupName = val;
                this._getRouteNames(val);
            },
            _getMileageBar(){
                this.mileageBar = {
                    title: {
                        text: '各线路投诉、超速对比'
                    },
                    grid:{
                        left:0,
                        top:'30%'
                    },
                    legend: {top:'15%'},
                    tooltip: {},
                    dataset: {
                        // 提供一份数据。
                        source: [
                            ['selfNum', '投诉', '超速'],
                            ['X104',  8, 75],
                            ['X105',  10, 55],
                            ['X115',  7, 43],
                            ['X122',  12, 60],
                            ['X101',  11, 46],
                            ['X109',  15, 42]
                        ]
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
                }
            },
            _getMileageTripKmRateBar(){
                let timesIntervals = [];
                let seriesDatas =[];
                let datasets = [{timesInterval:'06:00-08:00',totalRenues:10},
                                {timesInterval:'08:00-10:00',totalRenues:11},
                                {timesInterval:'10:00-12:00',totalRenues:15},
                                {timesInterval:'12:00-14:00',totalRenues:8},
                                {timesInterval:'14:00-16:00',totalRenues:9},
                                {timesInterval:'16:00-18:00',totalRenues:15},
                                {timesInterval:'18:00-20:00',totalRenues:20},
                                {timesInterval:'20:00-22:00',totalRenues:8}
                              ];

                datasets.forEach(ele => {
                    timesIntervals.push(ele.timesInterval);
                    seriesDatas.push({
                        name:ele.timesInterval,
                        value:ele.totalRenues
                    });
                });
                this.pieData = {
                    title: {text: '超速投诉时间分布'},
                    tooltip: {trigger: 'item',formatter: '{a} <br/>{b}: {c} ({d}%)'},
                    legend: {orient: 'horizontal',left:0, top:30, data: timesIntervals},
                    series: [
                        {
                            name: '线路营收',
                            type: 'pie',
                            radius: ['50%', '70%'],
                            avoidLabelOverlap: false,
                            label: {
                                normal: {show: false,position: 'center'},
                                emphasis: {show: true, textStyle: {fontSize: '30',fontWeight: 'bold'}}
                            },
                            labelLine: {normal: {show: false}},
                            data: seriesDatas
                        }
                    ]
                }
            },
        }
    }
</script>