<template>
  <div></div>
</template>
<script>
  import authService from "../services/auth/authService";

  export default {
    name: "logout",
    created() {
      authService().logOut();
      this.$router.push('/login');
    }
  }
</script>

<style scoped>

</style>
