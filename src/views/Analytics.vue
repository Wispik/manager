<template>
  <vs-card>
    <vs-row>
      <vs-col vs-w="12" class="mr-2">
        <h2>Статистика за период</h2>
        <br>
        <v-date-picker
          mode='range'
          v-model="dateRange"/>
      </vs-col>
      <template v-if="null !== statistic">
        <vs-col
          vs-w="6"
          class="pr-2"
        >
          <vs-card>
            <vs-row>
              <vs-col vs-w="4" class="mr-2">
                <statistics-card-line
                  hideChart
                  class="mb-base"
                  icon="EyeIcon"
                  :statistic="statistic.register_period"
                  statisticTitle="Новых пользователей за период"/>
              </vs-col>
              <vs-col vs-w="4">
                <statistics-card-line
                  hideChart
                  class="mb-base"
                  icon="EyeIcon"
                  :statistic="statistic.buy_period"
                  statisticTitle="Покупок за период"/>
              </vs-col>
            </vs-row>
            <div class="vx-col w-full">
              <h4>Покупки за период </h4>
              <vue-apex-charts
                type="bar"
                :series="buyPeriodChart.series"
                :options="buyPeriodChart.options"
              ></vue-apex-charts>
            </div>
            <div class="vx-col w-full">
              <h4>Тарифы за период</h4>
              <vue-apex-charts
                type="bar"
                :series="buyPeriodTarifChart.series"
                :options="buyPeriodTarifChart.options"
              ></vue-apex-charts>
            </div>
          </vs-card>
        </vs-col>
        <vs-col
          vs-w="6"
          class="pl1"
        >
          <vs-card>
            <vs-row>
              <vs-col vs-w="4">
                <statistics-card-line
                  hideChart
                  class="mb-base"
                  icon="EyeIcon"
                  :statistic="statistic.buy_more"
                  statisticTitle="Повторные покупки"/>
              </vs-col>
            </vs-row>
            <h4>Повторные покупки за периода</h4>
            <vue-apex-charts
              type="bar"
              :series="buyMoreChart.series"
              :options="buyMoreChart.options"
            ></vue-apex-charts>
            <h4>Повторные тарифы за периода</h4>
            <vue-apex-charts
              type="bar"
              :series="buyMoreTarifChart.series"
              :options="buyMoreTarifChart.options"
            ></vue-apex-charts>
          </vs-card>
        </vs-col>
        <vs-col
          vs-w="6"
          class="pr-2"
        >
          <vs-card>
            <vs-row>
              <vs-col vs-w="4">
                <statistics-card-line
                  hideChart
                  class="mb-base"
                  icon="EyeIcon"
                  :statistic="statistic.register_before"
                  statisticTitle="Новых пользователей до периода"/>
              </vs-col>
            </vs-row>
            <h4>Покупки до периода </h4>
            <vue-apex-charts
              type="bar"
              :series="registerBeforePrice.series"
              :options="registerBeforePrice.options"
            ></vue-apex-charts>
            <h4>Тарифы до периода</h4>
            <vue-apex-charts
              type="bar"
              :series="registerBeforeTarifs.series"
              :options="registerBeforeTarifs.options"
            ></vue-apex-charts>
          </vs-card>
        </vs-col>
      </template>
    </vs-row>
  </vs-card>
</template>

<script>
  import usersService from "@/services/usersService";
  import StatisticsCardLine from '@/components/statistics-cards/StatisticsCardLine.vue'
  import VueApexCharts from 'vue-apexcharts'
  import {getGraphData} from "../helpers/statisticDataGenerator";

  export default {
    name: "Statistic",
    components: {
      StatisticsCardLine,
      VueApexCharts,
    },
    data() {
      return {
        dateRange: {
          start: new Date(new Date().setDate(1)),
          end: new Date(),
        },
        statistic: null,
      }
    },
    mounted() {
    },
    methods: {
      async getStatistic() {
        this.statistic = await usersService().getStatistic(this.dateRange);
      },
    },
    computed: {
      buyPeriodChart() {
        return getGraphData(this.statistic, 'price_period', 'Покупок');
      },
      buyPeriodTarifChart() {
        return getGraphData(this.statistic, 'tarif_period', 'Покупок');
      },
      buyMoreChart() {
        return getGraphData(this.statistic, 'buy_more_price', 'Покупок');
      },
      buyMoreTarifChart() {
        return getGraphData(this.statistic, 'buy_more_tarif', 'Покупок');
      },
      registerBeforePrice() {
        return getGraphData(this.statistic, 'register_before_price', 'Покупок');
      },
      registerBeforeTarifs() {
        return getGraphData(this.statistic, 'register_before_tarif', 'Покупок');
      },
    },
    watch: {
      dateRange: {
        handler: 'getStatistic',
        deep: true,
        immediate: true,
      }
    }
  }
</script>

<style scoped>

</style>
