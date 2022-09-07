<template>
	<div class="schedule-wrap">
		<el-row class="schedule-panel">
			<el-row :gutter="20">
				<el-col :span="3">
					<el-select size="mini" v-model="select.groupName" @change="groupNameChange" placeholder="请选择大队">
				   		<el-option v-for="groupName in routeGroups" :key="groupName" :label="groupName" :value="groupName"></el-option>
			    	</el-select>
				</el-col>

                <el-col :span="3">
					<el-select size="mini" v-model="select.routeName" placeholder="请选择线路">
				   		<el-option v-for="routeName in routeList" :key="routeName" :label="routeName" :value="routeName"></el-option>
			    	</el-select>
				</el-col>
				
                <el-col :span="4">
					<el-date-picker size="mini" v-model="select.workdate" type="date" value-format="yyyy-MM-dd" placeholder="选择日期"></el-date-picker>
				</el-col>

				<el-col :span="2">
					<el-button type="primary" size="mini" @click="_getDailyReport">查询</el-button>
				</el-col>

				<el-col :span="2">
					<el-button type="primary" size="mini" @click="exportData">下载</el-button>
				</el-col>
		 	</el-row>

		 	<el-table max-height="500" v-loading="loading" size="small" :data="dataTables" align="center" highlight-current-row style="width: 100%">
                <el-table-column align="center" type="index" width="50"></el-table-column>
			    <el-table-column align="center" prop="date" label="日期" width="100"></el-table-column>
                <el-table-column align="center" prop="selfNum" label="车号" width="80"></el-table-column>
                <el-table-column align="center" prop="cash" label="收银收入" width="100"></el-table-column>
                <el-table-column align="center" prop="alipay" label="支付宝收入" width="100"></el-table-column>
                <el-table-column align="center" prop="revenue" label="IC卡收入" width="100"></el-table-column>
				<el-table-column align="center" prop="xxykt" label="虚拟卡收入" width="100"></el-table-column>
                <el-table-column align="center" prop="total" label="总收入" width="100"></el-table-column>
                <el-table-column align="center" prop="trip" label="趟次" width="50"></el-table-column>
                <el-table-column align="center" prop="tripAvgRevenue" label="单车平均趟值" width="100"></el-table-column>
                <el-table-column align="center" prop="powerConsumption" label="油/电" width="100"></el-table-column>
                <el-table-column align="center" prop="consumptionAvg100" label="百公里耗能" width="80"></el-table-column>
                <el-table-column align="center" prop="totalMileage" label="日总公里" width="100"></el-table-column>
                <el-table-column align="center" prop="tripAvgMileage" label="趟公里" width="100"></el-table-column>
		 	</el-table>
		</el-row>
	</div>
</template>
<script>
    import {getRouteGroup,getRouteNames} from '@/api/common'
	import {getDailyReport} from '@/api/statistics'
	import axios from 'axios'
	import { getToken } from '@/utils/auth'
    import {REQ_SUCCESS,baseURL} from '@/utils/APIConstans'
	export default{
		name:"statistics-workplan-driver",
		data(){
			return {
				routeList:[],
                routeGroups:[],
                select:{
                    groupName:'',
                    workdate:'',
                    routeName:''
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
				let url = baseURL + "/statistics/operating/download/daily?routeName=" + this.select.routeName + "&workdate=" + this.select.workdate;
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
			        let fileName = this.select.workdate + "_" + this.select.routeName + "_日报表.xlsx";
			        link.setAttribute('download', fileName);
			        document.body.appendChild(link);
			        link.click();
				})
			},
			_getDailyReport(){
				getDailyReport(this.select).then(resp => {
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