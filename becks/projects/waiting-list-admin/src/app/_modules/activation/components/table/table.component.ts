
import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from '../../../../_models/User';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { DomSanitizer} from '@angular/platform-browser';
import { MatIconRegistry} from '@angular/material/icon';
import { UserListService } from 'src/app/_services/UserList.service';


@Component({
  selector: 'waiting-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  providers: [UserListService]
})
export class TableComponent implements OnInit {

  authorizated_users: any[] = [];
  ELEMENT_DATA: User[];
  public dataSource;
  public selection;
  displayedColumns: string[] = ['select','first_name', 'last_name', 'email','mobile_phone','trash'];
  //add paginator to the table
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  //add sorting to the table
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  // add conexion with pop-up
  allow:boolean = false;
  currentPg: number;
  numPage:number;
  sizeUser:number;

  constructor(    
    public userListService: UserListService,
    iconRegistry: MatIconRegistry, 
    sanitizer: DomSanitizer) {
      iconRegistry.addSvgIcon(
        'trash-bin',
        sanitizer.bypassSecurityTrustResourceUrl('../../../assets/icon/trash-alt.svg'));

     }

  ngOnInit() {
    this.dataSource = new MatTableDataSource<User>(this.ELEMENT_DATA);
    this.selection = new SelectionModel<User>(true, []);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.onSelectNumber(0, 10);
    this.changePage(10);
    this.currentPg = 0;
  }
  onSelectNumber( page?:number, size?:number): void {
    this.userListService.getUser(page, size , true).subscribe((res: any) => {
      this.dataSource.data = res.items as User[];
      console.log(res);
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
      console.log( this.authorizated_users);
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
      console.log(this.numPage);
    }else {
      this.numPage = Math.floor((total/size));
      console.log(this.numPage);
    }
  }
  changePage(option:any):void{
    this.sizeUser = option;
     this.onSelectNumber(this.currentPg, this.sizeUser);
   }
  controlPage(operation:String):void {
    let finalPg = this.numPage;
    if((operation == 'prev') && (this.currentPg > 0)){
      this.currentPg -= 1;
    }else if((operation == 'next') && (this.currentPg < finalPg-1 )) {
      this.currentPg += 1;
    }
    this.onSelectNumber(this.currentPg, this.sizeUser);
    console.log(this.currentPg);
  }

  delete(){
    console.log(this.selection.selected);
    // if (this.authorizated_users.length > 0) {
    //   this.authorizated_users = [];
    // }
    // this.selection.clicked.forEach(item => {
    //   this.authorizated_users.push(item.id);
    //   console.log( this.authorizated_users);
    // }    
    // );
    // console.log(userId);
    // this.userListService.deleteUser(userId).subscribe(
    //   res => {
    //     console.log('received ok response from patch request', res);
    //     location.reload();
    //   },
    //   error => {
    //     console.error('There was an error during the request');
    //     console.log(error);
    //   });
  }
}
