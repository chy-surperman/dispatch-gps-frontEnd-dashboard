<template>
	<div class="dashboard-container">
        <el-tabs v-model="activeName" @tab-click="handleTabClick">
            <el-tab-pane v-for="tab in tabs" :key="tab.name" :label="tab.label" :name="tab.name">
                <el-row>
                    <el-row :gutter="20">
                        
                        <el-col :span="5">
                            <el-date-picker size="mini" v-model="tab.model.workdate" type="month" value-format="yyyy-MM"  @change="dateChange(tab.name)"  placeholder="选择月份"></el-date-picker>
                        </el-col>

                        <el-col :span="3" v-if="tab.name <= 1">
                            <el-select size="mini" v-model="tab.model.routeName" placeholder="请选择线路">
                                <el-option v-for="routeName in routeList" :key="routeName" :label="routeName" :value="routeName"></el-option>
                            </el-select>
                        </el-col>

                        <el-col :span="2">
                            <el-button type="primary" size="mini" @click="getDatas(tab.name)">查询</el-button>
                        </el-col>

                        <el-col :span="2">
                            <el-button type="primary" size="mini" @click="exportData(tab.name)">下载</el-button>
                        </el-col>
                    </el-row>

                    <div class="tableBox" v-for="route in tab.dataTables" :key="route.title">
                        <h4 v-text="route.title"></h4>
                        <el-table max-height="500" size="small" :data="route.mileages" align="center" highlight-current-row style="width: 100%">
                            <el-table-column v-for="dayObj in tab.days" :prop="dayObj.dayStr" :label="dayObj.day" :key="dayObj.id" :width="dayObj.width"></el-table-column>
                        </el-table>
                    </div>
                 </el-row>
            </el-tab-pane>
        </el-tabs>
	</div>
</template>
<script>
    import axios from 'axios'
    import { getToken } from '@/utils/auth'
    import {getRouteGroup,getRouteNames} from '@/api/common'
    import {getReportIcCardRouteNames,getStatisticsVehicleReportMielage} from '@/api/statistics'
    import {REQ_SUCCESS,baseURL} from '@/utils/APIConstans'
    import {getTableHeader} from '@/utils/dateTableHeader'
	export default{
		name:"statistics-mileage-report",
		data(){
			return {
                activeName:"0",
                tabs:[],
				routeList:[],
                routeGroups:[],
			}
        },
        created(){
            let tabs = [];
            for(let i = 0; i < 1; i++){
                tabs.push({
                    label:"",
                    name: i + '',
                    model:{
                        routeName:'',
                        workdate:''
                    },
                    days:[],
                    dataTables:[]
                });
            }
            tabs[0].label = "车辆里程上报统计";
            this.tabs = tabs;
			this._getRouteNames();
		},
		methods:{
			_getRouteNames(){
				getReportIcCardRouteNames().then(resp => {
					if(resp.code == REQ_SUCCESS){
						this.routeList = resp.result;
					}
				})
            },
            handleTabClick(){

            },
			getDatas(name){
                let tabIndex = this.tabs.findIndex(ele => ele.name == name);
                let tab = this.tabs[tabIndex];
				switch(tab.name){
                    case '0':
                        this._getStatisticsVehicleReportMielage(tab,tab.model);
                        break;
                }
            },
            _getStatisticsVehicleReportMielage(tab,param){
                getStatisticsVehicleReportMielage(param).then(resp => {
                   if(resp.code == REQ_SUCCESS){
                        for(let i = 0; i < resp.result.length; i++){
							resp.result[i].mileages = this.handlerResult(tab,resp.result[i].mileages);
							resp.result[i].title = this.getTilePrefix(tab,resp.result[i].routeName) + '_车辆里程上报统计表';
						}
                        tab.dataTables = resp.result;
                    }else{
                        this.$message.error(resp.define);
                    }
                })
            },
			handlerResult(tab,result){
				let dayArr = tab.days;
				result.forEach(ele => {
					for(let i = 0; i < dayArr.length; i++){
                        if(undefined == ele[dayArr[i].dayStr] || null == ele[dayArr[i].dayStr] 
                            || 0.00 == ele[dayArr[i].dayStr] || '' == ele[dayArr[i].dayStr]){
							ele[dayArr[i].dayStr] = 0;
						}
					}
				});
				return result;
			},
			dateChange(name){
                let index = this.tabs.findIndex(ele => ele.name == name);
                let tab = this.tabs[index];
				let dayArr = getTableHeader(tab.model.workdate,60);
                
                if(name == 0){
                    dayArr.unshift({
                        id:-2,
                        dayStr:"selfNum",
                        width:80,
                        day:"车辆"
                    });
                }
				dayArr.push({
					id:-3,
					dayStr:"total",
					width:80,
					day:"合计"
				});	
				tab.days = dayArr;
				tab.dataTables = [];
            },
            getTilePrefix(tab,routeName){
				return tab.model.workdate + "_" + routeName;
			},
            exportData(name){
                let tabIndex = this.tabs.findIndex(ele => ele.name == name);
                let tab = this.tabs[tabIndex];
                
                let url = baseURL + "/statistics/reportMileage/download?routeName=" + tab.model.routeName + "&workdate=" + tab.model.workdate;
                let fileName = '';
                switch(tab.name){
                    case '0':
                        url = url + "&type=vehicle";
                        fileName = tab.model.workdate + "_" + tab.model.routeName + "_车辆里程上报统计表.xlsx";
                        break;
                }
				axios({
					method:'get',
			        url,
                    responseType:'blob',
                    headers:{
                        Authorization:getToken()
                    }
				}).then(data => {
					if(!data) {
						return;
					}
					let url = window.URL.createObjectURL(data.data);
			        let link = document.createElement('a');
			        link.style.display = 'none';
			        link.href = url;
			        link.setAttribute('download', fileName);
			        document.body.appendChild(link);
			        link.click();
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
    .tableBox {
		margin-top: 20px;
	}
	.tableBox h4{
		text-align: center;
	}
</style>