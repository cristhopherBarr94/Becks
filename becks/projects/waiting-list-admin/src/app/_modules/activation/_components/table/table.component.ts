
import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from '../../../../_models/User';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { DomSanitizer} from '@angular/platform-browser';
import { MatIconRegistry} from '@angular/material/icon';
import { UserListService } from 'src/app/_services/UserList.service';
import { ModalController } from '@ionic/angular';
import { NotifyModalComponent } from '../../../utils/_components/notify-modal/notify-modal.component';


@Component({
  selector: 'waiting-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  providers: [UserListService]
})
export class TableComponent implements OnInit {

  authorizated_users: any[] = [];
  deleted_users: any[] = [];
  ELEMENT_DATA: User[];
  public dataSource;
  public selection;
  displayedColumns: string[] = ['select','first_name', 'last_name', 'email','mobile_phone','trash'];
  //add paginator to the table
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  //add sorting to the table
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  allow:boolean;
  currentPg: number;
  numPage:number;
  sizeUser:number;

  constructor(    
    public userListService: UserListService,
    iconRegistry: MatIconRegistry, 
    sanitizer: DomSanitizer,
    private modalCtrl: ModalController ) { }

  ngOnInit() {
    this.dataSource = new MatTableDataSource<User>(this.ELEMENT_DATA);
    this.selection = new SelectionModel<User>(true, []);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.allow = false;
    this.currentPg = 0;
    this.sizeUser = 10;
    this.loadPage(this.currentPg, this.sizeUser);
  }
  loadPage( page:number, size:number): void {
    this.userListService.getUser(page, size , true).subscribe((res: any) => {
      this.dataSource.data = res.items as User[];
      this.calculatePages( res.total , size);
    });
    this.authorizated_users = [];
  }

  applyFilter(filterValue: String) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.authorizated_users = [];
    if (this.isAllSelected()) {
      this.selection.clear()
    } else {
      this.dataSource.data.forEach(row => {
        this.selection.select(row);
        this.authorizated_users.push(row.id);
      }
      );
    }
  }

  singleToggle() {
    if (this.authorizated_users.length > 0) {
      this.authorizated_users = [];
    }
    this.selection.selected.forEach(item => {
      this.authorizated_users.push(item.id);
    }    
    );
  }

  activateUser(): void {
    this.userListService.setActivateStatus(this.authorizated_users).subscribe(
      res => {
        console.log('received ok response from patch request', res);
        location.reload();
      },
      error => {
        console.error('There was an error during the request');
        console.log(error);
      });
  }

  calculatePages( total?:number , size?:number ): void {
    if( total % size ){
      this.numPage = Math.floor((total/size)) +1; 
    }else {
      this.numPage = Math.floor((total/size));
    }
  }
  
  changePage(option:any):void{
    this.sizeUser = option;
     this.loadPage(this.currentPg, this.sizeUser);
   }
  controlPage(operation:String):void {
    let finalPg = this.numPage;
    if((operation == 'prev') && (this.currentPg > 0)){
      this.currentPg -= 1;
    }else if((operation == 'next') && (this.currentPg < finalPg-1 )) {
      this.currentPg += 1;
    }
    this.loadPage(this.currentPg, this.sizeUser);
  }

  async showModal() {
    const modal =  await this.modalCtrl.create({
      component: NotifyModalComponent,
      cssClass: 'modalMessage',
      componentProps: {
        data:this.authorizated_users,
        amount: this.authorizated_users.length,
        allow:this.allow,
        actFunc: this.activateUser.bind(this),
        delFunc: this.delete.bind(this)
      }
    })
    await modal.present();
    modal.onDidDismiss()
    .then(res=> {this.deleted_users=[],this.allow=false})

  }

  delete ( userId?:number ){
    this.allow = true;
    if(this.deleted_users.length == 0){
      this.deleted_users.push(userId);
      this.showModal();
    }else {
      this.userListService.deleteUser(this.authorizated_users).subscribe(
        res => {
          console.log('received ok response from patch request', res);
          location.reload();
        },
        error => {
          console.error('There was an error during the request');
          console.log(error);
        });
    } 
  }
}
