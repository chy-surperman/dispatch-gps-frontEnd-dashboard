<template>
    <!-- <div id="dashboardLine" style="height:400px;"></div> -->
    <v-chart :options="lineData" width="100%" height="400px"></v-chart>
</template>

<script>
import vChart from '@/components/echarts/vChart'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/polar'
import {REQ_SUCCESS,baseURL} from '@/utils/APIConstans'
import {getLineData} from '@/api/analysis'

export default {
    components: {
        'v-chart': vChart
    },
    created(){
        this._getLineData();
    },
    mounted(){
        // let myCharts = this.$echarts.init(document.getElementById("dashboardLine"));
        // myCharts.setOption(this.lineData);
    },
    data () {
        return {
            dashboardLine:"dashboardLine",
            lineData: {
                title: {
                    text: '近一年非现金营收、油/电耗趋势图'
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
                        {name: 'totalRenues',displayName:'非现金营收',type:'float'},
                        {name: 'refuelingAmount',displayName:'油耗',type:'float'},
                        {name: 'charge',displayName:'电耗',type:'float'},
                    ],
                    source:[]
                },
                legend: {},
                xAxis:{type: 'category'},
                yAxis:{},
                calculable: true,
                series: [
                    {name:'营收',type:'line',encode:{x:'date',y:'totalRenues'},markLine:{data:[{type: 'average', name: '平均值'}]}},
                    {name:'油耗',type:'line',encode:{x:'date',y:'refuelingAmount'},markLine:{data:[{type: 'average', name: '平均值'}]}},
                    {name:'电耗',type:'line',encode:{x:'date',y:'charge'},markLine:{data:[{type: 'average', name: '平均值'}]}},
                ],
                animationDuration: 1000
            }
        }
    },
    methods:{
        _getLineData(){
            getLineData().then(resp => {
                if(resp.code == REQ_SUCCESS){
                    this.lineData = {
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

<style lang="scss" scoped>
    .echarts {
        width: 100%;
        height: 300px;
        margin:15px 0;
        padding: 10px;
	    background: #fff;
	    -webkit-box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
	    box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
	    border-color: rgba(0, 0, 0, 0.05);
    }
</style>