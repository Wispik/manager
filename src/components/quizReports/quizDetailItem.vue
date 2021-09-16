<template>
  <div>
    <h3>{{name}}</h3>
    <vue-apex-charts
      height="200"
      type="bar"
      :series="graphData.series"
      :options="graphData.options"
    />
  </div>
</template>

<script>
  import VueApexCharts from 'vue-apexcharts'
  import {getGraphData} from "../../helpers/statisticDataGenerator";


  export default {
    name: "quizDetailItem",
    props: {
      name: String,
      scores: Object,
    },
    components: {
      VueApexCharts,
    },
    computed: {
      graphData() {
        return {
          options: {
            plotOptions: {
              bar: {
                horizontal: true,
                barHeight: '50%',
              }
            },
            xaxis: {
              categories: Object.keys(this.scores),
            },
          },
          series: [{
            name: this.name,
            data:  Object.values(this.scores)
          }]
        }
      }
    }
  }
</script>

<style scoped>

</style>
