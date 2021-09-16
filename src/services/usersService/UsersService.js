import store from "@/store/store";
import axios from "@/axios";
import {formatDate} from "../DateService";

export class UsersService {
  getStatistic(dateRange) {
    return new Promise(async (resolve, reject) => {
      try {
        const requestParams = {
          date_from: formatDate(dateRange.start),
          date_to: formatDate(dateRange.end),
        };

        const {data} = await axios.request('stat/registers', {
          method: 'GET',
          params: {
            ...requestParams,
          }
        });

        resolve(data);
      } catch (e) {
        reject(e);
      }
    })
  }

  getUsers(page = 0, limit = 30, search) {
    return new Promise(async (resolve, reject) => {
      try {

        const requestParams = {
          page: page,
          per_page: limit,
        };

        if (search) {
          requestParams.search = search;
        }
        const {data} = await axios.request('/admin/users', {
          method: 'GET',
          params: {
            ...requestParams,
          }
        });

        resolve(data);
      } catch (e) {
        reject(e);
      }
    })
  }

  getProfile(id) {
    return new Promise(async (resolve, reject) => {
      try {
        const {data} = await axios.request('profile/get', {
          method: 'GET',
          params: {
            id,
          }
        });

        resolve(data);
      } catch (e) {
        reject(e);
      }
    })
  }

  getUserPayments(id) {
    return new Promise(async (resolve, reject) => {
      try {
        const {data} = await axios.request('admin/payments', {
          method: 'GET',
          params: {
            id,
          }
        });

        resolve(data.list);
      } catch (e) {
        reject(e);
      }
    })
  }

  getUserLogHistory(id) {
    return new Promise(async (resolve, reject) => {
      try {
        const {data} = await axios.request('admin/auth_log', {
          method: 'GET',
          params: {
            id,
          }
        });

        resolve(data.list);
      } catch (e) {
        reject(e);
      }
    })
  }

  createUser(user) {
    return new Promise(async (resolve, reject) => {
      try {
        const {status} = await axios.request('admin/register', {
          method: 'POST',
          data: {
            ...user,
          }
        });

        if (200 === status) {
          resolve(true);
        } else {
          reject();
        }
      } catch (e) {
        reject(e);
      }
    })
  }

  getTypesQuiz() {
    return new Promise(async (resolve, reject) => {
      try {
        const {data} = await axios.request('directory/rating_types', {
          method: 'GET',
        });

        resolve(data.list);
      } catch (e) {
        reject(e);
      }
    })
  }

  getPhotosList(seasonId) {
    return new Promise(async (resolve, reject) => {
      try {
        const {data} = await axios.request('report/photolist', {
          method: 'GET',
          params: {
            season_id: seasonId,
          }
        });

        resolve(data.list);
      } catch (e) {
        reject(e);
      }
    })
  }

  getPhotos(userId, seasonId) {
    return new Promise(async (resolve, reject) => {
      try {
        const {data} = await axios.request('report/photodetail', {
          method: 'GET',
          params: {
            user_id: userId,
            season_id: seasonId
          }
        });

        resolve(data);
      } catch (e) {
        reject(e);
      }
    })
  }

  addToFavorites(userId, seasonId) {
    return new Promise(async (resolve, reject) => {
      try {
        const {data} = await axios.request('report/add_favorites', {
          method: 'POST',
          data: {
            user_id: userId,
            season_id: seasonId
          }
        });

        resolve(true);
      } catch (e) {
        reject(e);
      }
    })
  }

  deleteFromFavorites(userId, seasonId) {
    return new Promise(async (resolve, reject) => {
      try {
        const {data} = await axios.request('report/del_favorites', {
          method: 'POST',
          data: {
            user_id: userId,
            season_id: seasonId
          }
        });

        resolve(true);
      } catch (e) {
        reject(e);
      }
    })
  }

  deletePhotos(userId, seasonId) {
    return new Promise(async (resolve, reject) => {
      try {
        const {data} = await axios.request('report/delet_photo_send_message', {
          method: 'POST',
          data: {
            user_id: userId,
            season_id: seasonId
          }
        });

        resolve(true);
      } catch (e) {
        reject(e);
      }
    })
  }

  getPhotoZip(userId, seasonId, name) {
    return new Promise(async (resolve, reject) => {
      try {
        const {data} = await axios.request('report/get_zip', {
          method: 'POST',
          data: {
            user_id: userId,
            season_id: seasonId
          },
          responseType: 'blob'
        });
        var fileURL = window.URL.createObjectURL(new Blob([data]));
        var fileLink = document.createElement('a');
        fileLink.href = fileURL;
        fileLink.setAttribute('download', `${name}.zip`);
        document.body.appendChild(fileLink);
        resolve(fileLink);
      } catch (e) {
        reject(e);
      }
    })
  }

  getSystemStat(seasonId) {
    return new Promise(async (resolve, reject) => {
      try {
        const {data} = await axios.request('rating/resultsystem', {
          method: 'GET',
          params: {
            season_id: seasonId,
          }
        });

        resolve(data.list);
      } catch (e) {
        reject(e);
      }
    })
  }

  getDetailsStat(season, id, typeId) {
    return new Promise(async (resolve, reject) => {
      try {
        const {data} = await axios.request('rating/resultdetail', {
          method: 'GET',
          params: {
            season_id: id,
            object_id: id,
            type: typeId,
          }
        });

        resolve(data.list);
      } catch (e) {
        reject(e);
      }
    })
  }

  getLearnQuiz(season) {
    return new Promise(async (resolve, reject) => {
      try {
        const {data} = await axios.request('rating/resultlearn', {
          method: 'GET',
          params: {
            season_id: season,
          }
        });

        resolve(data.list);
      } catch (e) {
        reject(e);
      }
    })
  }

  getSpecQuiz(season) {
    return new Promise(async (resolve, reject) => {
      try {
        const {data} = await axios.request('rating/resultspec', {
          method: 'GET',
          params: {
            season_id: season,
          }
        });

        resolve(data.list);
      } catch (e) {
        reject(e);
      }
    })
  }


  getSystemQuiz(season) {
    return new Promise(async (resolve, reject) => {
      try {
        const {data} = await axios.request('rating/resultsystem', {
          method: 'GET',
          params: {
            season_id: season,
          }
        });

        resolve(data.list);
      } catch (e) {
        reject(e);
      }
    })
  }

  getDetailQuiz(season, id, typeId) {
    return new Promise(async (resolve, reject) => {
      try {
        const {data} = await axios.request('rating/resultdetail', {
          method: 'GET',
          params: {
            season_id: season,
            object_id: id,
            type: typeId,
          }
        });

        resolve(data.list);
      } catch (e) {
        reject(e);
      }
    })
  }

  getProductInfo() {
    return new Promise(async (resolve, reject) => {
      try {
        const {data: seasons} = await axios.request('directory/seasons', {
          method: 'GET',
        });

        const {data: seasonsDates} = await axios.request('directory/seasonsdates', {
          method: 'GET',
        });

        const {data: tarifs} = await axios.request('directory/tarifs', {
          method: 'GET',
        });

        resolve({
          seasons: seasons.list,
          seasonsByDate: seasonsDates.list,
          tarifs: tarifs.list,
        });
      } catch (e) {
        reject(e);
      }
    })
  }

  resetPasswordOnEmail(userId) {
    return new Promise(async (resolve, reject) => {
      const {data} = await axios.request('admin/auth_reset', {
        method: 'POST',
        data: {
          user_id: userId,
        }
      });

      if (data.message) {
        reject(data.message);
      }

      resolve(data);
    })
  }

  resetPasswordOnSMS(userId) {
    return new Promise(async (resolve, reject) => {
      const {data} = await axios.request('admin/auth_reset_sms', {
        method: 'POST',
        data: {
          user_id: userId,
        }
      });

      if (data.message) {
        reject(data.message);
      }

      resolve(data);
    })
  }

  resendAuthInfo(userId) {
    return new Promise(async (resolve, reject) => {
      const {data} = await axios.request('admin/login_info', {
        method: 'POST',
        data: {
          user_id: userId,
        }
      });

      if (data.message) {
        reject(data.message);
      }

      resolve(data);
    })
  }

  changeEmail(userId, email) {
    return new Promise(async (resolve, reject) => {
      const {data} = await axios.request('admin/changeemail', {
        method: 'POST',
        data: {
          user_id: userId,
          email
        }
      });

      if (data.message) {
        reject(data.message);
      }

      resolve(data);
    })
  }
}
