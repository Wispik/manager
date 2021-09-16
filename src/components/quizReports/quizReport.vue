<template>
  <div>
      <vs-table
        @input="clickHandler"
        stripe
        :data="data">
        <template
          #header
        >
          <h3 class="mb-4">Результаты опроса</h3>
        </template>
        <template #thead>
          <vs-th>Название опроса</vs-th>
          <vs-th>Баллов</vs-th>
          <vs-th>Участников</vs-th>
          <vs-th>Средний бал</vs-th>
        </template>
        <template slot-scope="{data}">
          <vs-tr
            :data="tr"
            :key="indextr"
            v-for="(tr, indextr) in data"
          >
            <vs-td>
              {{tr.name}}
              {{tr.last_name}}
              {{tr.position}}
            </vs-td>
            <vs-td>
              {{tr.balls}}
            </vs-td>
            <vs-td>
              {{tr.count}}
            </vs-td>
            <vs-td>
              {{tr.avg}}
            </vs-td>
          </vs-tr>
        </template>
      </vs-table>
  </div>
</template>

<script>
  export default {
    name: "QuizReports",
    props: {
      type: {
        required: true,
        type: Number,
      },
      data: {
        required: true,
        type: Array,
      },
      getDetail: {
        type: Function,
      },
    },
    methods: {
        clickHandler(data) {
          if (typeof this.getDetail ==='function') {
            this.getDetail(data.id);
          }
      },
    },
  }
</script>

<style scoped>

</style>
