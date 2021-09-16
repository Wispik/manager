<template>
  <div>
    <vs-card>
      <vs-table
        :sst="true"
        @search="searchUser"
        :max-items="limit"
        search
        @selected="goDetailUserPage"
        stripe
        :data="users"
        class="mb-4"
      >
        <template #header>
          <h2 >Список пользователей</h2>
          <vs-button radius icon="person_add"
                     class="ml-4"
          @click="showCreateUserForm = true"></vs-button>
        </template>
        <template #thead>
          <vs-th>id</vs-th>
          <vs-th>Имя</vs-th>
          <vs-th>Фамилия</vs-th>
          <vs-th>email</vs-th>
          <vs-th>Сезон</vs-th>
          <vs-th>Тариф</vs-th>
          <vs-th>Город</vs-th>
          <vs-th>Телефон</vs-th>
        </template>
        <template slot-scope="{data}">
          <vs-tr :key="dataInd"
                 :data="tr"
                 v-for="(tr, dataInd) in data" >
            <vs-td :data="tr.id">{{tr.id}}</vs-td>
            <vs-td :data="tr.name">{{tr.name}}</vs-td>
            <vs-td :data="tr.last_name">{{tr.last_name}}</vs-td>
            <vs-td :data="tr.email">{{tr.email}}</vs-td>
            <vs-td :data="tr.season">{{tr.season}}</vs-td>
            <vs-td :data="tr.tarif">{{tr.tarif}}</vs-td>
            <vs-td :data="tr.city">{{tr.city}}</vs-td>
            <vs-td :data="tr.phone">{{tr.phone}}</vs-td>
          </vs-tr>
        </template>
      </vs-table>
      <vs-pagination :total="pageCount" v-model="currentPage"></vs-pagination>
    </vs-card>
    <vs-prompt
      @accept="onAcceptHandler"
      title="Добавить пользователя"
      :is-valid="validEmail"
      :active.sync="showCreateUserForm">
      <create-user-form
        v-model="newUser"
      ></create-user-form>
    </vs-prompt>
  </div>
</template>

<script>
  import usersService from "@/services/usersService";
  import createUserForm from "@/components/createUserForm";

  export default {
    name: "UserList",
    data() {
      return {
        users: [],
        newUser: {},
        currentPage: 1,
        limit: 15,
        pageCount: 0,
        total: 0,
        selected: [],
        search: '',
        showCreateUserForm: false,
      }
    },
    components: {
      createUserForm,
    },
    created() {
      this.handleChangePage();
    },
    methods: {
      async onAcceptHandler() {
        this.newUser.name = this.newUser.name || 'Имя';
        this.newUser.phone = this.newUser.phone || '+71111111111';
        this.newUser.password = this.newUser.password || this.generatePassword();
        this.newUser.price = this.newUser.price || '00.00';

        if (this.newUser.hasOwnProperty('combo')) {
          if (this.newUser.combo) {
            this.newUser.action_code = "combo_site";
          }
          delete this.newUser.combo;
        }

        if (this.newUser.hasOwnProperty('isCurrentSeason')) {
          if (this.newUser.isCurrentSeason) {
            if (this.newUser.hasOwnProperty('tarif')) {
              delete this.newUser.tarif;
            }
            if (this.newUser.hasOwnProperty('season')) {
              delete this.newUser.season;
            }
          } else {
            if (this.newUser.hasOwnProperty('tarif_code')) {
              delete this.newUser.tarif_code;
            }
          }
          delete this.newUser.isCurrentSeason;
        }

        await usersService().createUser(this.newUser);
        this.$vs.notify({
          color:'success',
          title:'Пользователь добавлен',
        });
        this.newUser = {};
      },
      async handleChangePage(page = 0) {
        const data = await usersService().getUsers(page, this.limit, this.search);
        this.users = [...data.list];
        this.total = data.count;
        this.pageCount = data.pages;
      },
      goDetailUserPage(user) {
        this.$router.push(`/user/${user.id}`);
      },
      async searchUser(searching) {
        this.search = searching;
        this.handleChangePage();
      },
      generatePassword() {
        let password = Math.random().toString(36).slice(-8);
        if (password.length < 6) {
          this.generatePassword();
        }
        return password;
      }
    },
    computed:{
      validEmail(){
        return this.newUser.email || false;
      }
    },
    watch:{
      currentPage() {
        this.handleChangePage(this.currentPage);
      }
    }
  }
</script>

<style scoped>

</style>
