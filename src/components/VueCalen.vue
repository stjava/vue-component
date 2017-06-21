<template>
    <div class="cale-table">
        <div class="year-month-select-style">
            <div class="year-select-style">
                <div class="left-dot" @click="prevYear()">
                    <i class="city"></i>
                </div>
                <input type="" name="" :value="timeYY+'年'" readonly>
                <div class="right-dot" @click="nextYear()">
                    <i class="city"></i>
                </div>
            </div>
            <div class="month-select-style">
                <div class="left-dot" @click="prevMonth()">
                    <i class="city"></i>
                </div>
                <input type="" name="" :value="timeMM+'月'" readonly>
                <div class="right-dot" @click="nextMonth()">
                    <i class="city"></i>
                </div>
            </div>
        </div>
        <!-- 日历主体 -->
        <table class="cale-style">
            <thead>
                <tr>
                    <td>日</td>
                    <td>一</td>
                    <td>二</td>
                    <td>三</td>
                    <td>四</td>
                    <td>五</td>
                    <td>六</td>
                </tr>
            </thead>
            <tbody>
                <tr v-for="y in 6">
                    <td v-for="x in 7" :class="caleClass(x,y)" v-text="tdText(x,y)" @click="tdClick(x,y)">
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>


<script>
export default {
    name: 'vue-calen',
    props: {
        dayData: Array
    },
    data: function () {
        return {
            timeYY: '',
            timeMM: '',
            timeDD: '',
            dateList: []
        }
    },
    created: function () {
        //页面创建时
        this.initDate();
    },
    computed: {

    },
    methods: {
        //初始化
        initDate: function () {
            //初始化日历
            this.setNowDate();
            //当前月
            let monthNow = new Date(this.timeYY, this.timeMM - 1, 1);
            //第一天
            let fisrtDay = monthNow.getDay();
            //当前时间的字符串
            let thisTimeStr = this.getDateStr(new Date());
            //遍历42个TD
            for (let day = 0; day < 42; day++) {
                //生成当前表格的日期
                let _thisDay = new Date(this.timeYY, this.timeMM - 1, day + 1 - fisrtDay);
                let _thisDayStr = this.getDateStr(_thisDay);
                let dataTemp = {
                    //当前表格日期
                    date: _thisDay,
                    //当前表格的日期字符串
                    daysStr: _thisDayStr,
                    isThisDay: _thisDayStr == thisTimeStr ? true : false, //当前表格是否是今天
                    //当前表格是否是这个月
                    isThisMonth: _thisDay.getMonth() == (this.timeMM - 1) ? true : false,
                    data: this.dayData ? this.dayData[day] : ''
                };
                //一定要用push，不然不会触发视图更新
                this.dateList.push(dataTemp);
            }
        },
        //创建日历
        renderCalc: function () {
            //判断当前月第一天是星期几
            let monthNow = new Date(this.timeYY, this.timeMM - 1, 1);
            let fisrtDay = monthNow.getDay();
            //当前时间的字符串
            // let thisTimeStr = this.getDateStr(new Date(this.timeYY, this.timeMM, this.timeDD));
            let nowDay = this.getDateStr(new Date());
            //遍历42个TD
            for (let day = 0; day < 42; day++) {
                //生成当前表格的日期
                let _thisDay = new Date(this.timeYY, this.timeMM - 1, day + 1 - fisrtDay);
                let _thisDayStr = this.getDateStr(_thisDay);
                this.dateList[day].date = _thisDay;
                this.dateList[day].daysStr = _thisDayStr;
                //当前表格是否是今天;
                this.dateList[day].isThisDay = (_thisDayStr == nowDay) ? true : false;
                this.dateList[day].isThisMonth = _thisDay.getMonth() == (this.timeMM - 1) ?
                    true : false;
            }
        },
        setNowDate: function () {
            //获取今日时间
            let dateNow = new Date();
            this.timeYY = dateNow.getFullYear();
            this.timeMM = dateNow.getMonth() + 1;
            this.timeDD = dateNow.getDate();
        },
        clickNow: function () {
            this.setNowDate();
            this.renderCalc();
        },
        //是否为闰年
        isLeap: function (year) {
            return (year % 100 == 0 ? res = (year % 400 == 0 ? 1 : 0) : res = (year % 4 ==
                0 ? 1 : 0));
        },
        getMonthList: function () {
            //根据年份返回当前年 每个月天数 的数组
            return (new Array(31, 28 + this.isLeap(this.timeYY), 31, 30, 31, 30, 31, 31, 30,
                31, 30, 31)); //各月份的总天数
        },
        getDateStr: function (date) {
            // 根据传入日期，返回其字符串
            var _year = date.getFullYear();
            var _month = date.getMonth() + 1; // 月从0开始计数
            var _d = date.getDate();
            _month = (_month > 9) ? ("" + _month) : ("0" + _month);
            _d = (_d > 9) ? ("" + _d) : ("0" + _d);
            return _year + _month + _d;
        },
        //计算需要绑定的class(td)
        caleClass: function (x, y) {
            return {
                'cale-notThisMonth': !(this.dateList[((y - 1) * 7 + x) - 1].isThisMonth),
                'cale-isThisDay': this.dateList[((y - 1) * 7 + x) - 1].isThisDay
            };
        },
        //计算单元格的值
        tdText: function (x, y) {
            return this.dateList[((y - 1) * 7 + x) - 1].date.getDate();
        },
        prevMonth: function () {
            // 上一月
            if (this.timeMM > 1) {
                this.timeMM -= 1;
            } else {
                this.timeYY -= 1;
                this.timeMM = 12;
            }
            this.$emit('prev-month', new Date(this.timeYY, this.timeMM - 1, this.timeDD))
            this.renderCalc();
        },
        nextMonth: function () {
            // 下一月
            if (this.timeMM < 12) {
                this.timeMM += 1;
            } else {
                this.timeYY += 1;
                this.timeMM = 1;
            }
            this.$emit('next-month', new Date(this.timeYY, this.timeMM - 1, this.timeDD))
            this.renderCalc();
        },
        prevYear: function () {
            // 上一年
            this.timeYY -= 1;
            this.$emit('prev-year', new Date(this.timeYY, this.timeMM - 1, this.timeDD))
            this.renderCalc();
        },
        nextYear: function () {
            // 下一年
            this.timeYY += 1;
            this.$emit('next-year', new Date(this.timeYY, this.timeMM - 1, this.timeDD))
            this.renderCalc();
        },
        turnMonth: function (month) {
            //跳转到某月
            this.timeMM = month;
            this.renderCalc();
        },
        //某一天的点击事件
        tdClick: function (x, y) {
            console.log(this.dateList[((y - 1) * 7 + x)])
            this.$emit('day-click', this.dateList[((y - 1) * 7 + x)])
        }
    }
}
</script>

<style type="text/css">

</style>