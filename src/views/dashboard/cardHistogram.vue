<template>
	<el-row :gutter="20" class="panel-group">
        <el-col :span="12" style="margin-left:0">
            <v-chart :options="radarData" width="100%" height="400px"></v-chart>
		</el-col>

		<el-col :span="12">
            <v-chart :options="pieData" width="100%" height="400px"></v-chart>
		</el-col>
	</el-row>
</template>

<script>
	
    import {REQ_SUCCESS,baseURL} from '@/utils/APIConstans'
    import {getPieData,getRadarData} from '@/api/analysis'
    import vChart from '@/components/echarts/vChart'
	export default {
        name:"cardPanel",
        components:{
            'v-chart': vChart
        },
		data(){
			return {
                dashboardRadar:"dashboardRadar",
                dashboardPie:"dashboardPie",
                radarData:{
                    title: {text: '公司营运雷达图'},
                    grid:{left:50,top:'20%'},
                    tooltip: {trigger: 'axis'},
                    animationDuration: 1000,
                    legend:{top:'10%',left:0, data:null},
                    radar:{
                        indicator:null,
                        textStyle: {
                            color: '#fff',
                            backgroundColor: '#999',
                            borderRadius: 3,
                            padding: [3, 5]
                        }
                    },
                },
                pieData:{
                    title: {text: '近一周线路营收'},
                    tooltip: {trigger: 'item',formatter: '{a} <br/>{b}: {c} ({d}%)'},
                    legend: {orient: 'horizontal',left:0, top:30, data: []},
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
                            data: []
                        }
                    ]
                }
			}
		},
		created(){
            this._getPieData();
            this._getRadarData();
		},
		methods:{
			_getPieData(){
				getPieData().then(resp => {
                    
					if(resp.code == REQ_SUCCESS){
                        let routeNames = [];
                        let seriesDatas =[];

                        resp.result.forEach(ele => {
                            routeNames.push(ele.routeName);
                            seriesDatas.push({
                                name:ele.routeName,
                                value:ele.totalRenues
                            });
                        });
						this.pieData = {
                            legend: {data: routeNames},
                            series: [
                                {
                                    data: seriesDatas
                                }
                            ]
                        };
					}
				});
            },
            _getRadarData(){
				getRadarData().then(resp => {
                    const {legend,datas} = resp.result;
					if(resp.code == REQ_SUCCESS){
                        let dimens = {
                            totalRenues:'营收',
                            vehicles:'出车数',
                            drivers:'司机数',
                            totalCharges:'电耗',
                            totalFuels:'油耗',
                            totalMileages:'公里数',
                            totalTrips:'趟次',
                        };
                        let propValues = {};
                        datas.forEach(ele => {
                            let values = [];
                            for(let prop in ele){
                                if(typeof(propValues[prop]) == "undefined"){
                                    propValues[prop] = [];
                                }
                                propValues[prop].push(ele[prop]);
                            }
                        });

                        let seriesDatas = [];
                        datas.forEach(ele => {
                            let values = [];
                            for(let prop in propValues){
                                if(prop != 'groupName'){
                                    values.push(ele[prop]);
                                }
                            }
                            seriesDatas.push({
                                name:ele.groupName,
                                value:values
                            })
                        });

                        let indicator = [];
                        for(let prop in propValues){
                            if(prop != 'groupName'){
                                indicator.push({
                                    name: dimens[prop],
                                    max: propValues[prop].reduce((e1,e2) => e1 > e2 ? e1 : e2)
                                });    
                            }
                        }

                        let series = [];
                        series.push({
                            name:'车队营运',
                            type:'radar',
                            data:seriesDatas
                        });
                        this.radarData = {
                            legend:{data:legend},
                            radar:{
                                indicator,
                            },
                            series
                        };
					}
				});
            },
            
		}
	}
</script>

<style lang="scss" scoped>
	.echarts {
        width: 100%;
        height: 300px;
        padding: 10px;
        margin:15px 0;
	    background: #fff;
	    -webkit-box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
	    box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
	    border-color: rgba(0, 0, 0, 0.05);
    }
</style>