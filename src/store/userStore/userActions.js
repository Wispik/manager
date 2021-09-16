import UsersService from "@/services/usersService";

export default {
  async getProductInfo({commit}) {
    const {seasons, seasonsByDate,tarifs }= await UsersService().getProductInfo();

    commit('SET_SEASONS', seasons);
    commit('SET_SEASONS_BY_DATE', seasonsByDate);
    commit('SET_TARIFS', tarifs);
  }
}
