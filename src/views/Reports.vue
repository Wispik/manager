<template>
  <vs-card v-if="!isLoading">
    <vs-select
      @input-changed="getData"
      label="Сезон"
      width="100%"
      class="mb-4"
    v-model="season">
      <vs-select-item :key="index" :value="item.id" :text="item.name" v-for="(item,index) in seasonsByDate" />
    </vs-select>

    <vs-tabs v-if="quizTypes.length > 0" class="mb-2">
      <vs-tab :label="`${quiz.name}`" v-for="quiz of quizTypes"
              :key="quiz.id"
      @click="() => typeHandler(quiz)"
      />
    </vs-tabs>
    <quiz-reports
      :data="data"
      :type="currentTab.id"
      :getDetail="getDetail"
    ></quiz-reports>
    <vs-popup fullscreen :active.sync="detailPopUp"
              :title="`Детали опроса: ${detailPopUpTitle}`">
      <quiz-detail
        :data="detailQuiz"
      />
    </vs-popup>
  </vs-card>
</template>

<script>
  import usersService from "@/services/usersService";
  import QuizReports from '@/components/quizReports/quizReport';
  import QuizDetail from '@/components/quizReports/quizDetail';
  import {mapState} from "vuex";

  export default {
    name: "Reports",
    components: {
      QuizReports,
      QuizDetail
    },
    data() {
      return {
        quizTypes: [],
        currentTab: null,
        data: [],
        season: null,
        isLoading: true,
        detailQuiz: null,
        detailPopUp: false,
        detailPopUpTitle: '',
      }
    },
    created() {
      this.handleChangePage();
    },
    computed: {
      ...mapState('user', ['seasonsByDate']),
    },
    methods: {
      async handleChangePage() {
        await this.$store.dispatch('user/getProductInfo');
        this.quizTypes = await usersService().getTypesQuiz();

        if (this.quizTypes.length > 0 ) {
          this.currentTab = this.quizTypes[0]
        }

        this.season = this.$store.state.user.seasonsByDate[0].id;
        await this.getData();
        this.isLoading = false;
      },
      async getData() {
        const {season} = this;
        switch (this.currentTab.name) {
          case 'Материал' :
            this.data = await usersService().getLearnQuiz(season);
            break;
          case 'Специалист' :
            this.data = await usersService().getSpecQuiz(season);
            break;
          case 'Система' :
            this.data = await usersService().getSystemStat(season);
            break;
        }
      },
      async getDetail(id) {
        const {season, currentTab} = this;

        this.detailQuiz = await usersService().getDetailQuiz(season, id, currentTab.id);
        this.detailPopUp = true;
        this.detailPopUpTitle = this.data.find(data => data.id === id).name;
      },
      typeHandler(quiz) {
        this.currentTab = quiz;
        this.getData();
      }
    },
    beforeRouteUpdate(to, from, next) {
      next();
    },
    watch: {
      season() {
        this.getData();
      }
    }

  }
</script>

<style scoped>

</style>
