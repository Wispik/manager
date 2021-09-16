<template>
  <div>
    <vx-input-group class="mb-base">
      <vs-checkbox v-model="user.isCurrentSeason">Добавить пользователя на текущий сезон</vs-checkbox>
    </vx-input-group>
    <vx-input-group class="mb-base">
      <vs-input class="inputx" v-model="user.name" label-placeholder="Имя"></vs-input>
    </vx-input-group>
    <vx-input-group class="mb-base">
      <vs-input class="inputx" v-model="user.phone" type="tel" label-placeholder="Номер телефона"></vs-input>
    </vx-input-group>
    <vx-input-group class="mb-base">
      <vs-input class="inputx"
                v-model="user.email"
                type="email"
                required
                :danger="!this.user.email"
                danger-text="Поле email обязательно"
                label-placeholder="E-mail"></vs-input>
    </vx-input-group>
    <vx-input-group class="mb-base">
      <vs-input class="inputx" v-model="user.password" type="password" label-placeholder="Пароль"></vs-input>
    </vx-input-group>
    <vx-input-group class="mb-base">
      <vs-input class="inputx" v-model="user.price" type="number" step="0.01" label-placeholder="Цена"></vs-input>
    </vx-input-group>
    <vx-input-group class="mb-base">
      <vs-checkbox v-model="user.combo">Комбо</vs-checkbox>
    </vx-input-group>
    <div :class="{ hidden: !user.isCurrentSeason }">
      <vx-input-group class="mb-base">
        <vs-select v-model="user.tarif_code" placeholder="Тариф"  width="100%">
          <vs-select-item :key="index" :value="item.code" :text="item.name" v-for="(item,index) in currentSeasonTarifs"/>
        </vs-select>
      </vx-input-group>
    </div>
    <div :class="{ hidden: !!user.isCurrentSeason }">
      <vx-input-group class="mb-base">
        <vs-select v-model="user.tarif" placeholder="Тариф"  width="100%">
          <vs-select-item :key="index" :value="item.id" :text="item.name" v-for="(item,index) in tarifs"/>
        </vs-select>
      </vx-input-group>
      <vx-input-group class="mb-base">
        <vs-select v-model="user.season" placeholder="Сезон" width="100%">
          <vs-select-item :key="index" :value="item.id" :text="item.name" v-for="(item,index) in seasonsByDate"/>
        </vs-select>
      </vx-input-group>
    </div>
  </div>
</template>

<script>
  import {mapState} from 'vuex';

  export default {
    name: "createUserForm",
    model: {
      prop: 'user',
      event: 'input',
    },
    props: {
      user: {},
    },
    data: () => ({
      currentSeasonTarifs: [
        {
          code: "light_standart",
          name: "Лайт",
        },
        {
          code: "pro1_standart",
          name: "ПРО(1 курс)",
        },
        {
          code: "pro2_pro",
          name: "ПРО(2 курс)",
        },
      ],
    }),
    mounted() {
      this.$store.dispatch('user/getProductInfo');
    },
    computed: {
      ...mapState('user', ['seasonsByDate', 'tarifs']),
    },
    methods: {

    },
  }
</script>

<style scoped>

</style>
