<template>
  <div class="profile">
    <vs-row v-if="user">
      <vs-col vs-w="7" class="pr-4">
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
                    <vs-dropdown-item @click="resetPasswordHandler"> Сбросить пароль</vs-dropdown-item>
                    <vs-dropdown-item  @click="resetSMSHandler">Отправить пароль по СМС</vs-dropdown-item>
                    <vs-dropdown-item  @click="activeNewEmailPrompt = true">Сменить почту</vs-dropdown-item>
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

        <vs-card  class="mt-base">
          <vs-table
            :max-items="10"
            stripe
            :data="userLogHistory"
            pagination
            class="mb-4"
          >
            <template #header>
              <h4 class="mb-4">Логи авторизации</h4>
            </template>
            <template #thead>
              <vs-th>Дата и время авторизации</vs-th>
            </template>
            <template slot-scope="{data}">
              <vs-tr
                :data="tr"
                v-for="(tr, ind) in data">
                <vs-td>{{tr}}</vs-td>
              </vs-tr>
            </template>
          </vs-table>

        </vs-card>

        <vs-card  class="mt-base">
          <vs-table
            :max-items="10"
            stripe
            :data="userPayments"
            pagination
            class="mb-4"
          >
            <template #header>
              <h4 class="mb-4">Платежи</h4>
            </template>
            <template #thead>
              <vs-th>Сезон</vs-th>
              <vs-th>Время сезона</vs-th>
              <vs-th>Цена</vs-th>
              <vs-th>Тариф</vs-th>
              <vs-th>Акция</vs-th>
            </template>
            <template slot-scope="{data}">
              <vs-tr
                :data="tr"
                :key="ind"
                v-for="(tr, ind) in data">
                <vs-td>{{tr.season}}</vs-td>
                <vs-td>{{tr.season_date}}</vs-td>
                <vs-td>{{tr.price}}</vs-td>
                <vs-td>{{tr.tarif}}</vs-td>
                <vs-td>{{tr.action}}</vs-td>
              </vs-tr>
            </template>
          </vs-table>

        </vs-card>
      </vs-col>
      <vs-col vs-w="5">
        <vs-card class="mt-base">
          <template #header>
            <h3>Норма</h3>
          </template>
          <vs-list>
            <vs-list-item title="Калории">{{user.norma.calories}}</vs-list-item>
          </vs-list>
        </vs-card>
        <vs-card class="mt-base">
          <template #header>
            <h3>Тариф и сезон</h3>
          </template>
          <vs-list>
            <vs-list-item v-if="user.tarif" title="Тариф"> {{user.tarif.name}}</vs-list-item>
            <vs-list-item v-if="user.season" title="Сезон"> {{user.season.name}}</vs-list-item>
          </vs-list>
        </vs-card>
        <vs-card class="mt-base">
          <template #header>
            <h3>Диагнозы</h3>
          </template>
          <div v-if="user.diagnoses && user.diagnoses.length > 0">
            <div v-for="(d, index) in user.diagnoses" :key="index">
              <vs-row vs-w="12" class="mb-5">
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
        </vs-card>
      </vs-col>
    </vs-row>
    <vs-prompt
      @cancel="newEmail=''"
      @accept="acceptEmail"
      :active.sync="activeNewEmailPrompt"
      title="Сменить почту пользователя"
    >
      <vs-input
        placeholder="Новая почта"
        v-model="newEmail"
        class="w-full"
      ></vs-input>
    </vs-prompt>
  </div>
</template>

<script>
  import usersService from "@/services/usersService";

  export default {
    name: "UserDetailPage",
    data() {
      return {
        user: null,
        userPayments: [],
        userLogHistory: [],
        newEmail: '',
        activeNewEmailPrompt: false,
      }
    },
    created() {
      this.handleChangePage();
    },
    methods: {
      async handleChangePage() {
        this.user = await usersService().getProfile(this.$route.params.id);
        this.userPayments = await usersService().getUserPayments(this.$route.params.id);
        this.userLogHistory = await usersService().getUserLogHistory(this.$route.params.id);
      },
      async resetPasswordHandler() {
        await usersService().resetPasswordOnEmail(this.user.id);

        this.$vs.notify({
          color:'success',
          title:'Ссылка на сброс отправлена',
        })
      },
      async resetSMSHandler() {
        await usersService().resetPasswordOnSMS(this.user.id);
        this.$vs.notify({
          color:'success',
          title:'СМС отправлено',
        })
      },
      async acceptEmail() {
        await usersService().changeEmail(this.user.id, this.newEmail);

        this.$vs.notify({
          color:'success',
          title:'Почта успешно заменена',
        })
      },
    },
    beforeRouteUpdate(to, from, next) {
      // обрабатываем изменение параметров маршрута...
      // не забываем вызвать next()
      next();
    }
  }
</script>

<style scoped>

</style>
