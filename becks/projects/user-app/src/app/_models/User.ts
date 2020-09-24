export class User {
  id?: number;
  first_name?: string;
  last_name?: string;
  mobile_phone?: string;
  gender?: string;
  email?: string;
  password?: string;
  waitingState?: number;
  delete?: boolean;

  phone?: string;

  type_id?: string;
  id_number?: string;

  captcha?: string;
  captcha_key?: number;
  promo?: boolean;
  privacy?: boolean;

  status_waiting_list?: boolean;
}
