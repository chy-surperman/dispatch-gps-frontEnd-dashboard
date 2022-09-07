<template>
    <div class="dashboard-container" id="dashboard-container">
        <div class="dialogstart">
            <el-button type="primary" @click="showQueryDialog" icon="el-icon-setting" circle></el-button>
            <br/>
            <el-button type="primary" @click="downloadDailytable" icon="el-icon-download" circle></el-button>
        </div>
        <setting-dialog></setting-dialog>
        <div id="overview">
            <card-panel></card-panel>
            <text-panel></text-panel>
        </div>
        <trip-analysis></trip-analysis>
        <mileage-analysis></mileage-analysis>
        <driver-income-analysis></driver-income-analysis>
    </div>
</template>

<script>
import html2canvas from 'html2canvas'
import JsPDF from 'jspdf'

import cardPanel from '@/views/analysis/route/dailytable/cardPanel'
import textPanel from '@/views/analysis/route/dailytable/textPanel'
import settingDialog from '@/views/analysis/route/dailytable/settingDialog'
import tripAnalysis from '@/views/analysis/route/dailytable/tripAnalysis'
import mileageAnalysis from '@/views/analysis/route/dailytable/mileageAnalysis'
import driverIncomeAnalysis from '@/views/analysis/route/dailytable/driverIncomeAnalysis'

export default {
    name: 'routeDailyTable',
    components:{
        cardPanel,
        textPanel,
        settingDialog,
        tripAnalysis,
        mileageAnalysis,
        driverIncomeAnalysis
    },
    data(){
        return {
            panel:{
                
            }
        }
    },
    mounted(){
        this.listenDownloadEvent();
    },
    beforeDestroy(){
        this.$EventBus.$off('down_route_daily_table');
    },
    methods:{
        showQueryDialog(){
            this.$store.dispatch('routeDailytable/showRouteDailyTableDialog',true);
        },
        downloadDailytable(){
            this.$EventBus.$emit('down_route_daily_table');
        },
        listenDownloadEvent(){
            this.$EventBus.$on('down_route_daily_table',(event) => {
               this.downReport();
            });
        },
        saveFile(filename,data){  
            var save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');  
            save_link.href = data;  
            save_link.download = filename;  
            
            var event = document.createEvent('MouseEvents');  
            event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);  
            save_link.dispatchEvent(event);  
        },
        toPdf(canvas,title){
            let contentWidth = canvas.width
            let contentHeight = canvas.height
            let pageHeight = contentWidth / 592.28 * 841.89
            let leftHeight = contentHeight
            let position = 0
            let imgWidth = 595.28
            let imgHeight = 592.28 / contentWidth * contentHeight
            let pageData = canvas.toDataURL('image/jpeg', 1.0)
            let PDF = new JsPDF('', 'pt', 'a4')
            if (leftHeight < pageHeight) {
                PDF.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight)
            } else {
                while (leftHeight > 0) {
                    PDF.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight)
                    leftHeight -= pageHeight
                    position -= 841.89
                    if (leftHeight > 0) {
                    PDF.addPage()
                    }
                }
            }
            PDF.save(title + '.pdf')
        },
        downReport(){
            let _this = this;
            console.log(document.getElementById('dashboard-container'));
            html2canvas(document.getElementById('dashboard-container')).then(canvas => {
                _this.toPdf(canvas,"overview");
                // let imgData = canvas.toDataURL("image/png");
                // imgData = imgData.replace("image/png",'image/octet-stream');
                // _this.saveFile("overview.png",imgData);
            });
        },
    }
}
</script>

<style scoped>
.dashboard-container {
    margin: 30px;
    overflow-y: scroll;
}
.dialogstart {
    position: fixed;
    z-index: 100;
    height: 100px;
    width: 41px;
    top:45%;
    right: 10px;
}
</style>
