<template>
    <div>
        <query-condition @query="queryChart"></query-condition>
        <el-row :gutter="20" style="margin:15px;">
            <el-col :span="24">
                <!-- <v-chart :options="radarData" style="width:100%;"/> -->
                <v-chart :options="radarData" width="100%" height="400px"></v-chart>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import {REQ_SUCCESS,baseURL} from '@/utils/APIConstans'
    import {getOperationRataData} from '@/api/analysis'
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
                routeList:[],
                routeGroups:[],
                select:{
                    groupName:'',
                    workdate:'',
                    routeName:''
                },
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
                }
            }
        },
        methods:{
            queryChart(data){
                this._getRarda(data);
            },
            _getRarda(data){
                getOperationRataData(data).then(resp => {
                    
                    if(resp.code != REQ_SUCCESS){
                        return;
                    }
                    const {legend,datas} = resp.result;
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
                });
                
            },
        }
    }
</script>