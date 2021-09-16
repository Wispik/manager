<template>
  <div>
    <h2 class="mb-4">Фото фигуры</h2>
    <vs-row>
      <vs-col vs-w="5">
        <vs-card>
          <h2 class="mb-4">До</h2>
          <div class="images">
            <img
              v-for="img in photosBefore"
              :key="img.id"
              :src="img.path"
            >
          </div>
          <h3 class="mt-2">
            Комментарий "До"
          </h3>
          <div class="mt-2" v-if="commentBefore">
            {{ commentBefore }}
          </div>
        </vs-card>
      </vs-col>
      <vs-col vs-w="5" vs-offset="1">
        <vs-card>
          <h2 class="mb-4">После</h2>
          <div class="images">
            <img
              v-for="img2 in photosAfter"
              :key="img2.id"
              :src="img2.path"
            >
          </div>
          <h3 class="mt-2" v-if="commentAfter">
            Комментарий "После"
          </h3>
          <div class="mt-2">
            {{ commentAfter }}
          </div>
        </vs-card>
      </vs-col>
    </vs-row>
  </div>
</template>

<script>
import usersService from "@/services/usersService";

export default {
  data() {
    return {
      photosBefore: [],
      photosAfter: [],
      commentBefore: '',
      commentAfter: ''
    }
  },
  mounted() {
    this.handleChangePage()
  },
  methods: {
    async handleChangePage() {
      const data = await usersService().getPhotos(this.$route.params.id);
      this.photosBefore = [...data.before]
      this.photosAfter = [...data.after]
      this.commentBefore = data.before_comment
      this.commentAfter = data.after_comment
    }
  }
}
</script>

<style lang="scss" scoped>
  .images {
    display: flex;
    flex-flow: row wrap;
    gap: 10px;
  }
</style>
