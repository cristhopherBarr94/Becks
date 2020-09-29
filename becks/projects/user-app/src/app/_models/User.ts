export class User {
  id: number;
  first_name: string;
  last_name: string;
  mobile_phone: string;
  gender: string;
  email: string;
  password: string;
  phone: string;
  delete: boolean;
  waitingState: number;
  status: number;
  status_waiting_list: boolean;
  last_login: string;
  birthdate: string;
  buy_code: string;

  type_id: string;
  id_number: string;

  captcha: string;
  captcha_key: number;
  promo: boolean;
  privacy: boolean;
  photo: string;

  constructor(data?: any) {
    if (data !== undefined) {
      this.id = data["id"] !== undefined ? data["id"] : undefined;
      this.first_name =
        data["first_name"] !== undefined ? data["first_name"] : undefined;
      this.last_name =
        data["last_name"] !== undefined ? data["last_name"] : undefined;
      this.mobile_phone =
        data["mobile_phone"] !== undefined ? data["mobile_phone"] : undefined;
      this.gender = data["gender"] !== undefined ? data["gender"] : undefined;
      this.email = data["email"] !== undefined ? data["email"] : undefined;
      this.password =
        data["password"] !== undefined ? data["password"] : undefined;
      this.waitingState =
        data["waitingState"] !== undefined ? data["waitingState"] : undefined;
      this.delete = data["delete"] !== undefined ? data["delete"] : undefined;
      this.status = data["status"] !== undefined ? data["status"] : undefined;
      this.phone = data["phone"] !== undefined ? data["phone"] : undefined;
      this.type_id =
        data["type_id"] !== undefined ? data["type_id"] : undefined;
      this.id_number =
        data["id_number"] !== undefined ? data["id_number"] : undefined;
      this.captcha =
        data["captcha"] !== undefined ? data["captcha"] : undefined;
      this.captcha_key =
        data["captcha_key"] !== undefined ? data["captcha_key"] : undefined;
      this.promo = data["promo"] !== undefined ? data["promo"] : undefined;
      this.privacy =
        data["privacy"] !== undefined ? data["privacy"] : undefined;
      this.status_waiting_list =
        data["status_waiting_list"] !== undefined
          ? data["status_waiting_list"]
          : undefined;
      this.photo = data["photo"] !== undefined ? data["photo"] : undefined;
      this.last_login =
        data["last_login"] !== undefined ? data["last_login"] : undefined;
      this.birthdate =
        data["birthdate"] !== undefined ? data["birthdate"] : null;
      this.buy_code = data["buy_code"] !== undefined ? data["buy_code"] : null;
    }
  }

  static fromJS(data: any): User {
    return new User(data);
  }

  toJS(data?: any) {
    data = data === undefined ? {} : data;
    data["id"] = this.id !== undefined ? this.id : null;
    data["first_name"] = this.first_name !== undefined ? this.first_name : null;
    data["last_name"] = this.last_name !== undefined ? this.last_name : null;
    data["mobile_phone"] =
      this.mobile_phone !== undefined ? this.mobile_phone : null;
    data["gender"] = this.gender !== undefined ? this.gender : null;
    data["email"] = this.email !== undefined ? this.email : null;
    data["password"] = this.password !== undefined ? this.password : null;
    data["phone"] = this.phone !== undefined ? this.phone : null;
    data["delete"] = this.delete !== undefined ? this.delete : null;
    data["waitingState"] =
      this.waitingState !== undefined ? this.waitingState : null;
    data["status"] = this.status !== undefined ? this.status : null;
    data["status_waiting_list"] =
      this.status_waiting_list !== undefined ? this.status_waiting_list : null;
    data["type_id"] = this.type_id !== undefined ? this.type_id : null;
    data["id_number"] = this.id_number !== undefined ? this.id_number : null;
    data["captcha"] = this.captcha !== undefined ? this.captcha : null;
    data["captcha_key"] =
      this.captcha_key !== undefined ? this.captcha_key : null;
    data["promo"] = this.promo !== undefined ? this.promo : null;
    data["privacy"] = this.privacy !== undefined ? this.privacy : null;
    data["photo"] = this.photo !== undefined ? this.photo : null;
    data["last_login"] = this.last_login !== undefined ? this.last_login : null;
    data["birthdate"] = this.birthdate !== undefined ? this.birthdate : null;
    data["buy_code"] = this.buy_code !== undefined ? this.buy_code : null;

    return data;
  }

  toJSON() {
    return JSON.stringify(this.toJS());
  }
}
