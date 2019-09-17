<template>
  <div id="root">
    <ve-waterfall :data="chartData" :settings="chartSettings"></ve-waterfall>
  </div>
</template>
<script>
import VeWaterfall from "v-charts/lib/waterfall";
export default {
  name: "app",
  components: {
    VeWaterfall
  },
  data() {
    this.chartSettings = {
      metrics: ["time"],
      dataOrder: {
        label: "耗时",
        order: "desc"
      }
    };
    return {
      chartData: {
        columns: ["事件", "time"],
        rows: [
          { 事件: "redirect", time: 0 },
          { 事件: "appCache", time: 0 },
          { 事件: "DNS", time: 0 },
          { 事件: "TCP ", time: 0 },
          { 事件: "request", time: 0 },
          { 事件: "response", time: 0 },
          { 事件: "渲染处理", time: 0 },
          { 事件: "抛出load事件", time: 0 }
          // { 事件: "总耗时", time: 0 }
        ]
      }
    };
  },
  mounted() {
    // 往浏览器注入load 事件，等事件回来再去获取 performance.timing 
    // chrome.tabs.executeScript 也可以以 js 文件注入
    chrome.tabs.executeScript(
      {
        code: `window.addEventListener("load", function load(event){
    window.removeEventListener("load", load, false);
    console.log("Web Performance Timing API data ready.")
},false);`
      },
      (res, err) => {
        if (res) {
          this.init();
        }
      }
    );
  },
  methods: {
    init() {
      chrome.tabs.executeScript(
        {
          code: `(function() {
    const timing = performance.timing;
    const redirect = timing.redirectEnd - timing.redirectStart;
    const appcache = Math.max(timing.domainLookupStart - timing.fetchStart, 0);
    const dns = timing.domainLookupEnd - timing.domainLookupStart;
    const conn = timing.connectEnd - timing.connectStart;
    const request = timing.responseStart - timing.requestStart;
    const response = timing.responseEnd - timing.responseStart;
    const processing = (timing.domComplete || timing.domLoading) - timing.domLoading;
    const load = timing.loadEventEnd - timing.loadEventStart;
    const total = (timing.loadEventEnd || timing.loadEventStart || timing.domComplete || timing.domLoading) - timing.navigationStart;
    return {redirect,appcache,dns,conn,request,response,processing,load,total};
  })();`
        },
        (res, err) => {
          debugger;
          const {
            redirect,
            appcache,
            dns,
            conn,
            request,
            response,
            processing,
            load,
            total
          } = res[0];
          this.chartData.rows[0].time = redirect;
          this.chartData.rows[1].time = appcache;
          this.chartData.rows[2].time = dns;
          this.chartData.rows[3].time = conn;
          this.chartData.rows[4].time = request;
          this.chartData.rows[5].time = response;
          this.chartData.rows[6].time = processing;
          this.chartData.rows[7].time = load;
          this.chartData.rows[8].time = total;
        }
      );
    }
  }
};
</script>
<style lang='less' scoped>
#root {
  width: 800px;
  height: auto;
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #333;
  background: #f5f5f5;
}
</style>