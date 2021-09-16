<template>
  <div>
    <quiz-detail-item
      v-for="item in data"
      :name="item.name"
      :scores="item.scores"
      :key="item.name"
    />
  </div>
</template>

<script>
  import QuizDetailItem from './quizDetailItem';

  export default {
    name: "quizDetail",
    props: {
      data: Array,
    },
    components: {
      QuizDetailItem
    }
  }
</script>

<style scoped>

</style>
