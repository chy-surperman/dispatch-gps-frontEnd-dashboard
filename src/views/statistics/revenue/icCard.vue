<template>
	<div class="dashboard-container">
        <el-tabs v-model="activeName" @tab-click="handleTabClick">
            <el-tab-pane v-for="tab in tabs" :key="tab.name" :label="tab.label" :name="tab.name">
                <el-row>
                    <el-row :gutter="20">
                        <el-col :span="5">
                            <el-date-picker size="mini" v-model="tab.model.workdate" type="month" value-format="yyyy-MM"  @change="dateChange(tab.name)"  placeholder="选择月份"></el-date-picker>
                        </el-col>

                        <el-col :span="3">
                            <el-select size="mini" v-model="tab.model.groupName" @change="groupNameChange" placeholder="请选择大队">
                                <el-option v-for="groupName in routeGroups" :key="groupName" :label="groupName" :value="groupName"></el-option>
                            </el-select>
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
                        <el-table max-height="500" size="small" :data="route.revenues" align="center" highlight-current-row style="width: 100%">
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
    import {statisticsRevenue,statisticsPersonflow,statisticsRouteRevenue,statisticsRoutePersonflow} from '@/api/statistics'
    import {REQ_SUCCESS,baseURL} from '@/utils/APIConstans'
    import {getTableHeader} from '@/utils/dateTableHeader'
	export default{
		name:"statistics-workplan-icCard",
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
            for(let i = 0; i < 4; i++){
                tabs.push({
                    label:"",
                    templateId:'3498542011495424',
                    name: i + '',
                    model:{
                        groupName:'',
                        routeName:'',
                        workdate:''
                    },
                    days:[],
                    dataTables:[]
                });
            }
            tabs[0].label = "IC卡收入统计";
            tabs[1].label = "IC卡客流量统计";
            tabs[2].label = "IC卡收入合计统计";
            tabs[3].label = "IC卡客流量合计统计";
            this.tabs = tabs;
			this._getRouteGroup();
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
            handleTabClick(){

            },
			getDatas(name){
                let tabIndex = this.tabs.findIndex(ele => ele.name == name);
                let tab = this.tabs[tabIndex];
                
                tab.model.templateId = tab.templateId;
				switch(tab.name){
                    case '0':
                        this._statisticsRevenue(tab,tab.model);
                        break;
                    case '1':
                        this._statisticsPersonflow(tab,tab.model);
                        break;
                    case '2':
                        this._statisticsRouteRevenue(tab,tab.model);
                        break;
                    case '3':
                        this._statisticsRoutePersonflow(tab,tab.model);
                        break;
                }
            },
            _statisticsRevenue(tab,param){
                statisticsRevenue(param).then(resp => {
                    if(resp.code == REQ_SUCCESS){
                        for(let i = 0; i < resp.result.length; i++){
							resp.result[i].revenues = this.handlerResult(tab,resp.result[i].revenues);
							resp.result[i].title = this.getTilePrefix(tab,resp.result[i].routeName) + '_IC卡统计表';
						}
                        tab.dataTables = resp.result;
                    }else{
                        this.$message.error(resp.define);
                    }
                })
            },
            _statisticsPersonflow(tab,param){
                statisticsPersonflow(param).then(resp => {
                    if(resp.code == REQ_SUCCESS){
                        for(let i = 0; i < resp.result.length; i++){
							resp.result[i].revenues = this.handlerResult(tab,resp.result[i].revenues);
							resp.result[i].title = this.getTilePrefix(tab,resp.result[i].routeName) + '_IC卡统计表';
						}
                        tab.dataTables = resp.result;
                    }else{
                        this.$message.error(resp.define);
                    }
                })
            },
            _statisticsRouteRevenue(tab,param){
                statisticsRouteRevenue(param).then(resp => {
                    if(resp.code == REQ_SUCCESS){
                        for(let i = 0; i < resp.result.length; i++){
							resp.result[i].revenues = this.handlerResult(tab,resp.result[i].revenues);
							resp.result[i].title = this.getTilePrefix(tab,resp.result[i].groupName) + '_IC卡统计表';
						}
                        tab.dataTables = resp.result;
                    }else{
                        this.$message.error(resp.define);
                    }
                })
            },
            _statisticsRoutePersonflow(tab,param){
                statisticsRoutePersonflow(param).then(resp => {
                    if(resp.code == REQ_SUCCESS){
                        for(let i = 0; i < resp.result.length; i++){
							resp.result[i].revenues = this.handlerResult(tab,resp.result[i].revenues);
							resp.result[i].title = this.getTilePrefix(tab,resp.result[i].groupName) + '_IC卡统计表';
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
						if(undefined == ele[dayArr[i].dayStr] || null == ele[dayArr[i].dayStr] || 0.00 == ele[dayArr[i].dayStr]){
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
                
                if(name == 0 || name == 1){
                    dayArr.unshift({
                        id:-2,
                        dayStr:"selfNum",
                        width:80,
                        day:"车辆"
                    });
                }else{
                    dayArr.unshift({
                        id:-2,
                        dayStr:"routeName",
                        width:80,
                        day:"线路"
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
			groupNameChange(val){
                this._getRouteNames(val);
			},
            getFileNamePrefix(){
				let fileName = this.select.workdate;
				if(this.select.groupName){
					fileName = "_" + this.select.groupName;
				}
				if(this.select.routeName){
					fileName = "_" + this.select.routeName;
				}
				return fileName;
			},
			getTilePrefix(tab,routeName){
				return tab.model.workdate + "_" + routeName;
			},
            exportData(name){
                let tabIndex = this.tabs.findIndex(ele => ele.name == name);
                let tab = this.tabs[tabIndex];
                
                let fileName = tab.model.workdate + "_" + tab.model.routeName + "_" + tab.label + ".xlsx";
                let url = this.getDownUrl(name,tab);
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
            getDownUrl(name,tab){
                let paramsUrl = "?templateId=" + tab.templateId + "&routeName=" + tab.model.routeName + "&workdate=" + tab.model.workdate + "&groupName=" + tab.model.groupName;
                let url = baseURL + "/statistics/income/down/";
                switch(tab.name){
                    case '0':
                        url = url + "revenue" + paramsUrl;
                        break;
                    case '1':
                        url = url + "personflow" + paramsUrl;
                        break;
                    case '2':
                        url = url + "routeRevenue" + paramsUrl;
                        break;
                    case '3':
                        url = url + "routePersonflow" + paramsUrl;
                        break;
                }
                return url;
            }
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