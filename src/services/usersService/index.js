import {UsersService} from "./UsersService";

let instance;

export default () => {
  if (!instance) {
    instance = new UsersService();
  }

  return instance;
};
