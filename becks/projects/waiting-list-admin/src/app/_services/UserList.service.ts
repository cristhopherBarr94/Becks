import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class UserListService {
  constructor(private httpClient: HttpClient) { }

  getUser(page: number, page_size?: number, status_waiting_list?: boolean) {
    return this.httpClient.get('http://becks.flexitco.co/becks-back/api/ab-inbev-api-web-app-user-list-api/', {
      params: {
        'page': page + '',
        'page_size': page_size + '',
        'status_waiting_list' : status_waiting_list + '',
        'time_stamp': (Math.floor(Date.now()/1000)) + ''
      }
    });
  }
  setActivateStatus(array_us: any) {
    console.log(array_us);
    return this.httpClient.patch('http://becks.flexitco.co/becks-back/api/ab-inbev-api-web-app-user-list-api/', array_us);
  }

  deleteUser(array_us: any) {
    return this.httpClient.delete('http://becks.flexitco.co/becks-back/api/ab-inbev-api-web-app-user-list-api/', array_us);
  }

  getSingleUser(id: any) {
    return this.httpClient.get('http://becks.flexitco.co/becks-back/api/ab-inbev-api-usercustom/', {
      params: {
        'id': id
      }
    });
  }

}
