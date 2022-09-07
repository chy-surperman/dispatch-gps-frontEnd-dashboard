<template>
	<div class="schedule-wrap">
		<el-row class="schedule-panel">
			<el-row :gutter="20" style="margin-bottom:15px;">
				
                <el-col :span="5">
					<el-date-picker size="mini" v-model="select.workdate" type="date" value-format="yyyy-MM-dd" placeholder="选择日期"></el-date-picker>
				</el-col>

				<el-col :span="2">
					<el-button type="primary" size="mini" @click="_getDailyReport">查询</el-button>
				</el-col>

				<el-col :span="2">
					<el-button type="primary" size="mini" @click="exportData">下载</el-button>
				</el-col>
		 	</el-row>

		 	<el-table max-height="550" v-loading="loading" size="small" :data="dataTables" align="center" highlight-current-row style="width: 100%">
                <el-table-column align="center" type="index" width="50"></el-table-column>
			    <el-table-column align="center" prop="routeName" label="线路" width="100"></el-table-column>
                <el-table-column align="center" prop="energyType" label="车型" width="80"></el-table-column>

                <el-table-column align="center" label="出车情况">
                    <el-table-column align="center" prop="vehicles" label="配车数" width="100"></el-table-column>
                    <el-table-column align="center" prop="runVehicles" label="出车数" width="100"></el-table-column>
                    <el-table-column align="center" prop="vehiclesDiff" label="未出车数" width="100"></el-table-column>
                </el-table-column>

                <el-table-column align="center" label="趟次情况">
				    <el-table-column align="center" prop="planDayTrip" label="计划趟次" width="100"></el-table-column>
                    <el-table-column align="center" prop="dayTrip" label="完成趟次" width="100"></el-table-column>
                    <el-table-column align="center" prop="finishDayTripRate" label="完成率" width="100"></el-table-column>
                </el-table-column>

                <el-table-column align="center" label="里程情况">
                    <el-table-column align="center" prop="planMileage" label="计划里程" width="100"></el-table-column>
                    <el-table-column align="center" prop="mileage" label="营运里程" width="100"></el-table-column>
                </el-table-column>
		 	</el-table>
		</el-row>
	</div>
</template>
<script>
    import {getRouteGroup,getRouteNames} from '@/api/common'
	import {getRouteTotalDailyReport} from '@/api/statistics'
	import axios from 'axios'
	import { getToken } from '@/utils/auth'
    import {REQ_SUCCESS,baseURL} from '@/utils/APIConstans'
	export default{
		name:"statistics-revenue-totalRouteDaily",
		data(){
			return {
				routeList:[],
                routeGroups:[],
                select:{
                    workdate:'',
                },
				dataTables:[],
				loading:false,
				days:[]
			}
		},
		methods:{
			_getRouteNames(groupName){
				this.loading = true;
				getRouteNames({groupName}).then(resp => {
					this.loading = false;
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
			exportData(){
				let url = baseURL + "/statistics/operating/download/routeTotalDaily?workdate=" + this.select.workdate;
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
			        let fileName = this.select.workdate +  "_出车日报表.xlsx";
			        link.setAttribute('download', fileName);
			        document.body.appendChild(link);
			        link.click();
				})
			},
			_getDailyReport(){
				getRouteTotalDailyReport(this.select).then(resp => {
					if(resp.code == REQ_SUCCESS){
						this.dataTables = resp.result;
					}
				});
			},
			groupNameChange(val){
                this.select.groupName = val;
                this._getRouteNames(val);
			}
		},
		created(){
			this._getRouteGroup();
		}
	}
</script>

<style scoped>
	.schedule-wrap{
		height: 99%;
		background: #fff;
	}
	.schedule-header{
		padding-top: 10px;
		padding-left: 20px;
	}
	.meta-panel{
		padding: 20px 10px 0 10px; 
	}
	.grid-content {
		margin-top: 10px;
        border-radius: 4px;
  	}
  	.schedule-panel {
  		margin: 15px;
  	}
</style>