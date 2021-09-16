<template>
  <div class="profile">
    <vs-row v-if="user">
      <vs-col vs-w="6">
        <vs-card :title="`Пользователь`" class="mt-base">
          <template #header>
            <vs-row vs-w="12"
                    vs-justify="space-between"
            >
              <vs-col vs-w="8">
                <h4 class="mt-3">{{user.first_name}} {{user.second_name}} {{user.last_name}}</h4>
              </vs-col>
              <vs-col vs-w="3" class="text-right">
                <vs-dropdown vs-trigger-click>
                  <vs-button>Действия</vs-button>
                  <vs-dropdown-menu>
                    <vs-dropdown-item @click="">Сбросить пароль</vs-dropdown-item>
                    <vs-dropdown-item>Отправить пароль по СМС</vs-dropdown-item>
                    <vs-dropdown-item>Сменить почту</vs-dropdown-item>
                  </vs-dropdown-menu>
                </vs-dropdown>
              </vs-col>
            </vs-row>
          </template>
          <vs-list>
            <vs-list-item title="id">{{user.id}}</vs-list-item>
            <vs-list-item title="Email">{{user.email}}</vs-list-item>
            <vs-list-item title="Телефон">{{user.phone}}</vs-list-item>
            <vs-list-item title="Город">{{user.city}}</vs-list-item>
            <vs-list-item title="Возраст">{{user.age}}</vs-list-item>
            <vs-list-item title="Пол">{{user.gender === 'M'? 'М' : 'Ж'}}</vs-list-item>
            <vs-list-item title="Дата рождения">{{user.birhday}}</vs-list-item>
            <vs-list-item title="Дата регистрации">{{user.date_register}}</vs-list-item>
            <vs-list-item title="Дата изменений">{{user.date_update}}</vs-list-item>
            <vs-list-item title="Последний IP">{{user.last_ip}}</vs-list-item>
          </vs-list>
        </vs-card>
      </vs-col>
      <vs-col vs-w="5" vs-offset="1">
        <vx-card :title="`Норма`" class="mt-base">
          <vs-list>
            <vs-list-item title="Калории">{{user.norma.calories}}</vs-list-item>
          </vs-list>
        </vx-card>
        <vx-card :title="`Тариф`" class="mt-base">
          <vs-list>
            <vs-list-item> {{user.tarif.name}}</vs-list-item>
          </vs-list>
        </vx-card>
        <vx-card :title="`Сезон`" class="mt-base">
          <vs-list>
            <vs-list-item> {{user.season.name}}</vs-list-item>
          </vs-list>
        </vx-card>
        <vx-card :title="`Диагнозы`" class="mt-base">
          <div v-if="user.diagnoses.length > 0">
            <div v-for="(d, index) in user.diagnoses">
              <vs-row vs-w="12" :key="index" class="mb-5">
                <vs-col vs-w="3">
                <vs-avatar :src="d.user.photo" size="large"/>
                </vs-col>
                <vs-col vs-w="9">
                  <h5 class="mb-4">{{d.user.name}} {{d.user.last_name}}</h5>
                  <h6>{{d.date}}</h6>
                  <p>{{d.comment}}</p>
                </vs-col>
              </vs-row>
              <vs-divider></vs-divider>
            </div>
          </div>
          <div v-else>Нет поставленных диагнозов</div>
        </vx-card>
      </vs-col>
    </vs-row>
  </div>
</template>

<script>
  import usersService from "@/services/usersService";

  export default {
    name: "UserDetailPage",
    data() {
      return {
        user: null,
      }
    },
    created() {
      this.handleChangePage();
    },
    methods: {
      async handleChangePage() {
        this.user = await usersService().getProfile(this.$route.params.id);
      }
    },
    beforeRouteUpdate(to, from, next) {
      // обрабатываем изменение параметров маршрута...
      // не забываем вызвать next()
      this.handleChangePage();
      next();
    }
  }
</script>

<style scoped>

</style>
