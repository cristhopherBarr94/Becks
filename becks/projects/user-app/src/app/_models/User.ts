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
        data["birthdate"] !== undefined ? data["birthdate"] : undefined;
    }
  }

  static fromJS(data: any): User {
    return new User(data);
  }

  toJS(data?: any) {
    data = data === undefined ? {} : data;
    if (this.id !== undefined) data["id"] = this.id;
    if (this.first_name !== undefined) data["first_name"] = this.first_name;
    if (this.last_name !== undefined) data["last_name"] = this.last_name;
    if (this.mobile_phone !== undefined)
      data["mobile_phone"] = this.mobile_phone;
    if (this.gender !== undefined) data["gender"] = this.gender;
    if (this.email !== undefined) data["email"] = this.email;
    if (this.password !== undefined) data["password"] = this.password;
    if (this.phone !== undefined) data["phone"] = this.phone;
    if (this.delete !== undefined) data["delete"] = this.delete;
    if (this.waitingState !== undefined)
      data["waitingState"] = this.waitingState;
    if (this.status !== undefined) data["status"] = this.status;
    if (this.status_waiting_list !== undefined)
      data["status_waiting_list"] = this.status_waiting_list;
    if (this.type_id !== undefined) data["type_id"] = this.type_id;
    if (this.id_number !== undefined) data["id_number"] = this.id_number;
    if (this.captcha !== undefined) data["captcha"] = this.captcha;
    if (this.captcha_key !== undefined) data["captcha_key"] = this.captcha_key;
    if (this.promo !== undefined) data["promo"] = this.promo;
    if (this.privacy !== undefined) data["privacy"] = this.privacy;
    if (this.photo !== undefined) data["photo"] = this.photo;
    if (this.last_login !== undefined) data["last_login"] = this.last_login;
    if (this.birthdate !== undefined) data["birthdate"] = this.birthdate;

    return data;
  }

  toJSON() {
    return JSON.stringify(this.toJS());
  }
}
