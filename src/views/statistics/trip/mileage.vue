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
        <el-col :span="5">
        <el-date-picker
            v-model="workdate"
            type="monthrange"
            value-format="yyyy-MM"
            range-separator="至"
            start-placeholder="开始月份"
            end-placeholder="结束月份">
        </el-date-picker>
        </el-col>

        <el-col :span="3">
          <el-button type="primary" size="mini" @click="getVehicelMileage">查询</el-button>
        </el-col>

        <el-col :span="2">
          <el-button type="primary" size="mini" @click="handleDownload">下载</el-button>
        </el-col>
      </el-row>
      <div class="tableBox">
        <h4  v-if="this.select.routeName"    v-text="this.select.routeName+'_车辆里程统计表'"></h4>
        <el-table max-height="1000" size="small" :data="dataTables" align="center" highlight-current-row style="width: 70%">
          <el-table-column
              type="index"
              label="序号"
              :index="indexMethod">
          </el-table-column>
          <el-table-column  prop="selfNum" label="自编号" align="center" ></el-table-column>
          <el-table-column  prop="routeName" label="线路名" align="center" ></el-table-column>
          <el-table-column  prop="plateNum" label="车牌号" align="center" ></el-table-column>
          <el-table-column  prop="operationMileage" label="营运里程" align="center"></el-table-column>
          <el-table-column  prop="nonOperationMileage" label="非营运里程" align="center"></el-table-column>
          <el-table-column  prop="totalGpsMileage" label="总里程" align="center"></el-table-column>
        </el-table>
      </div>
    </el-row>
  </div>
</template>
<script>
import axios from 'axios'
import { getToken } from '@/utils/auth'
import {getRouteGroup,getRouteNames} from '@/api/common'
import { getVehicleOperationMileage } from '@/api/analysis'
import {REQ_SUCCESS,baseURL} from '@/utils/APIConstans'
import {getTableHeader} from '@/utils/dateTableHeader'

export default{
  name:"statistics-mileage-vehicle",
  data(){
    return {
      routeList:[],
      routeGroups:[],
      select:{
        groupName:'',
        startDate:'',
        endDate:'',
        routeName:''
      },
      workdate:[],
      dataTables:[],
      routeTables:[],
      days:[]
    }
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
    getVehicelMileage(){
      this.select.startDate=this.workdate[0]+'-01',
      this.select.endDate=this.workdate[1]+'-31',
      getVehicleOperationMileage(this.select).then(resp => {
        if(resp.code == REQ_SUCCESS){
          this.dataTables = resp.result;
        }
      });
    },
    handlerResult(result){
      let dayArr = this.days;
      result.forEach(ele => {
        for(let i = 0; i < dayArr.length; i++){
          if(undefined == ele[dayArr[i].dayStr] || null == ele[dayArr[i].dayStr] || '' == ele[dayArr[i].dayStr]){
            ele[dayArr[i].dayStr] = 0;
          }
        }
      });
      return result;
    },
    indexMethod(index) {
      return index +1;
    },
    dateChange(val){
      this.createDay();
    },
    groupNameChange(val){
      this.select.groupName = val;
      this._getRouteNames(val);
    },
    createDay(){
      let dayArr = getTableHeader(this.select.workdate,55);
      dayArr.unshift({
        id:-1,
        dayStr:"selfNum",
        width:80,
        day:"车辆"
      });
      dayArr.push({
        id:-2,
        dayStr:"tripCount",
        width:80,
        day:"合计"
      });
      this.days = dayArr;
      this.dataTables = [];
    },
    exportData(){
      let url = baseURL + "/analysis/vehicle/mileage/compared?routeName="
          + this.select.routeName + "&startDate="
          + this.select.startDate + "&endDate="
          + this.select.endDate;

      let fileName = this.getFileNamePrefix() + "_车辆里程统计表.xlsx";
      axios({
        method:'get',
        url,
        responseType:'blob',
        headers:{
          Authorization:getToken()
        }
      }).then(data => {
        console.log(data)
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
    getTilePrefix(routeName){
      return this.select.workdate + "_" + routeName;
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
    handleDownload() {
      this.downloadLoading = true;
      import("@/vendor/Export2Excel").then((excel) => {
        const tHeader = [
          "自编号",
          "线路名",
          "车牌号",
          "营运里程",
          "非营运里程",
          "总里程"
        ];
        const filterVal = [
          "selfNum",
          "routeName",
          "plateNum",
          "operationMileage",
          "nonOperationMileage",
          "totalGpsMileage"
        ];
        const data = this.formatJson(filterVal, this.dataTables);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: this.select.routeName+"-车辆里程表"
        });
        console.log(filterVal)
        this.downloadLoading = false;
      });
    },
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
.tableBox {
  margin-top: 50px;
}
.tableBox h4{
  text-align: center;
}
</style>