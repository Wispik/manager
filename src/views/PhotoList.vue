<template>
  <div>
    <vs-card v-if="!isLoading">
      <vs-select
        @input-changed="loadData"
        label="Сезон"
        width="100%"
        class="mb-4"
        v-model="season">
          <vs-select-item :key="index" :value="item.id" :text="item.name" v-for="(item,index) in seasonsByDate" />
      </vs-select>
      <vs-table
        :data="paginationData"
        stripe
        class="mb-4"
      >
        <template #header>
          <h2 class="mb-4">Фото фигуры пользователей</h2>
          <vs-input
            icon="search"
            v-model="searchValue"
            icon-after="true"
          />
          <vs-checkbox
            v-model="showOnlyFavourites"
          >
            Только избранные
          </vs-checkbox>
        </template>
        <template #thead>
          <vs-th>ФИО</vs-th>
          <vs-th>email</vs-th>
          <vs-th>Телефон</vs-th>
          <vs-th>До</vs-th>
          <vs-th>После</vs-th>
          <vs-th>Детальная информация</vs-th>
          <vs-th>Избранное</vs-th>
        </template>
        <template slot-scope="{data}">
          <vs-tr
                v-for="tr in data"
                :key="tr.id"
                :data="tr" >
            <vs-td>{{tr.name}} {{tr.last_name}}</vs-td>
            <vs-td>{{tr.email}}</vs-td>
            <vs-td>
              <a :href="`https://wa.me/${tr.phone}`" target="_blank">{{tr.phone}}</a>
            </vs-td>
            <vs-td v-if="tr.dates.before.length > 0">
              <vs-button
                icon="check"
                @click="showModal('Комментарий До', tr.before_comment)"
                :type="tr.before_comment ? 'filled' : 'border'"
              ></vs-button>
            </vs-td>
            <vs-td v-else></vs-td>
            <vs-td v-if="tr.dates.after.length > 0">
              <vs-button
                icon="check"
                @click="showModal('Комментарий После', tr.after_comment)"
                :type="tr.after_comment ? 'filled' : 'border'"
              ></vs-button>
            </vs-td>
            <vs-td v-else></vs-td>
            <vs-td>
              <vs-button @click="showModalPhotoFunc(tr)">Подробно</vs-button>
            </vs-td>
            <vs-td v-if="!tr.favorites">
              <vs-button @click="addToFavorites(tr)">
                Добавить в избранное
              </vs-button>
            </vs-td>
            <vs-td v-else>
              <vs-button color="danger" @click="deleteFromFavorites(tr)">
                Удалить из избранного
              </vs-button>
            </vs-td>
          </vs-tr>
        </template>
      </vs-table>
      <vs-pagination :total="pageCount" v-model="currentPage"></vs-pagination>
    </vs-card>
    <vs-popup :title="modalTitle" :active.sync="showModalComment">
      {{ modalText }}
    </vs-popup>
    <vs-popup title="Фотографии" :active.sync="showModalPhoto">
      <div class="images">
        <div
          class="image-block"
          v-for="img in photos"
          :key="img.id"
        >
          <img
            v-if="img.srcBefore"
            class="image-block__img"
            :src="img.srcBefore"
            @click="showImage(img.srcBefore)"
          >
          <img
            v-if="img.srcAfter"
            class="image-block__img"
            :src="img.srcAfter"
            @click="showImage(img.srcAfter)"
          >
        </div>
      </div>
      <vs-button
        @click="downloadZip()"
        v-if="photos.length > 0"
        class="mt-4"
      >
        Скачать архив
      </vs-button>
      <vs-button
        @click="deletePhotosDialog()"
        color="danger"
        v-if="photos.length > 0"
        type="filled"
        class="ml-2"
      >
        Удалить фото
      </vs-button>
    </vs-popup>
    <vs-popup title="Фотография" :active.sync="showImageFullscreen">
      <div class="fullscreen-image">
        <img :src="srcImageFullScreen">
      </div>
    </vs-popup>
  </div>
</template>

<script>
import usersService from "@/services/usersService";
import {mapState} from "vuex";

export default {
  data() {
    return {
      data: [],
      currentPage: 1,
      total: 0,
      pageCount: 0,
      rowOnPage: 15,
      showModalComment: false,
      showModalPhoto: false,
      modalTitle: '',
      modalText: '',
      season: null,
      isLoading: true,
      photos: [],
      commentBefore: '',
      commentAfter: '',
      modalPhotosUserId: 0,
      showImageFullscreen: false,
      srcImageFullScreen: '',
      activeItem: null,
      showOnlyFavourites: false,
      searchValue: ''
    }
  },
  mounted() {
    this.handleChangePage()
  },
  methods: {
    async handleChangePage() {
      await this.$store.dispatch('user/getProductInfo');
      this.season = this.$store.state.user.seasonsByDate[0].id;
      await this.loadData()
      this.isLoading = false
    },
    async loadData() {
      this.$vs.loading()
      const data = await usersService().getPhotosList(this.season);
      this.data = [...data]
      this.data.sort((a, b) => {
        return (b.dates.after.length > 0 ? 1 : 0) - (a.dates.after.length ? 1 : 0)
      })
      this.data.sort((a, b) => {
        return (b.dates.before.length ? 1 : 0) - (a.dates.before.length ? 1 : 0)
      })
      this.total = this.data.length
      this.pageCount = Math.ceil(this.total / this.rowOnPage)
      this.$vs.loading.close()
    },
    showModal(title, text) {
      this.modalTitle = title
      this.modalText = text ? text : 'Нет комментария!'
      this.showModalComment = true
    },
    async showModalPhotoFunc(item) {
      this.activeItem = item
      const data = await usersService().getPhotos(item.id, this.season);
      this.commentBefore = data.before_comment
      this.commentAfter = data.after_comment

      if (data.before && data.after) {
        this.photos = data.before.map(function(item, index) {
          return {
            id: index,
            srcBefore: item.path,
            srcAfter: data.after[index] ? data.after[index].path : null
          }
        })
      } else if (data.before) {
        this.photos = data.before.map(function(item, index) {
          return {
            id: index,
            srcBefore: item.path,
            srcAfter: null
          }
        })
      } else if (data.after) {
        this.photos = data.after.map(function(item, index) {
          return {
            id: index,
            srcBefore: null,
            srcAfter: item.path
          }
        })
      } else {
        this.photos = []
      }
      this.modalPhotosUserId = item.id
      this.showModalPhoto = true
    },
    async addToFavorites(obj) {
      const data = await usersService().addToFavorites(obj.id, this.season)
      if (data) {
        obj.favorites = 1
        this.favoritesData = this.data.filter(item => {
          return item.favorites
        })
        this.data = [...this.data]
      }
    },
    async deleteFromFavorites(obj) {
      const data = await usersService().deleteFromFavorites(obj.id, this.season)
      if (data) {
        delete obj.favorites
        this.favoritesData = this.data.filter(item => {
          return item.favorites
        })
        this.data = [...this.data]
      }
    },
    async deletePhotos() {
      const data = await usersService().deletePhotos(this.activeItem.id, this.season)
      if (data) {
        this.photos = []
        this.showModalPhoto = false
      } else {
        this.showModalPhoto = true
      }
    },
    async deletePhotosDialog() {
      this.showModalPhoto = false
      this.$vs.dialog({
        type:'confirm',
        color: 'danger',
        title: `Внимание`,
        text: `Действительно удалить фото?`,
        accept: this.deletePhotos,
        cancel: () => {this.showModalPhoto = true}
      })
    },
    async downloadZip() {
      let today = new Date()
      today = today.toLocaleTimeString([], {year: 'numeric', month: 'numeric', day: 'numeric'}).split(',')[0]
      const name = `${this.activeItem.last_name.trim()}_${this.activeItem.name.trim()}_${this.activeItem.email}_${this.activeItem.phone}_${today}`
      const data = await usersService().getPhotoZip(this.modalPhotosUserId, this.season, name)
      data.click()
    },
    showImage(scr) {
      this.showModalPhoto = false
      this.srcImageFullScreen = scr
      this.showImageFullscreen = true
    }
  },
  computed: {
    ...mapState('user', ['seasonsByDate']),
    filteredData() {
      let data = []
      if (this.showOnlyFavourites) {
        data = this.data.filter(item => {
                  return item.favorites
                })
      } else {
        data = this.data
      }
      if (this.searchValue.length > 0) {
        const searchStr = this.searchValue.toLowerCase()
        data = data.filter(item => {
          return (
            item.name.toLowerCase().indexOf(searchStr) >= 0 ||
            item.last_name.toLowerCase().indexOf(searchStr) >= 0 ||
            item.email.toLowerCase().indexOf(searchStr) >= 0 ||
            item.phone.toLowerCase().indexOf(searchStr) >= 0
          )
        })
      }
      return data
    },
    paginationData() {
      let data = [...this.filteredData]
      const firstIndex = (this.currentPage - 1) * this.rowOnPage
      const lastIndex = firstIndex + this.rowOnPage
      return data.slice(firstIndex, lastIndex)
    }
  },
  watch: {
      season() {
        this.loadData();
      },
      showImageFullscreen(newVal) {
        if (newVal == false) {
          this.showModalPhoto = true
        }
      },
      filteredData(newVal) {
        this.currentPage = 1
        this.total = newVal.length
        this.pageCount = Math.ceil(this.total / this.rowOnPage)
      }
    }
}
</script>

<style lang="scss" scoped>
  .images {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .image-block {
    display: flex;
    flex-flow: row nowrap;

    & + & {
      margin-top: 10px;
    }
  }
  .image-block__img {
    max-height: 300px;
  }
  .image-block__img + .image-block__img {
    margin-left: 10px;
  }
  .fullscreen-image {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
