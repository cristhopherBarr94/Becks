import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderComponent } from 'src/app/_modules/utils/_components/header/header.component';
import { ExperienciasService } from 'src/app/_services/experiencias.service';
import { HttpService } from 'src/app/_services/http.service';
import { UiService } from 'src/app/_services/ui.service';

@Component({
  selector: 'user-interaction-view',
  templateUrl: './interaction-view.component.html',
  styleUrls: ['./interaction-view.component.scss'],
})
export class InteractionViewComponent implements OnInit , AfterViewInit {
  @ViewChild(HeaderComponent) header: HeaderComponent;
  public prevUrl: string = "/user/exp";
  public experience:any = [];
  public bgExp:string;
  public id: number;
  public titleExpView:string;

  constructor(
    public httpService: HttpService,
    private router: Router,
    private expService: ExperienciasService
  ) {}

  ngOnInit() {
    this.id = Number(this.router.url.replace("/user/interaction/",""));
    this.experience = this.expService.getActualExps();
    this.experience.forEach(exp => {
      if(this.id == exp.id){
        this.bgExp = exp.imagesExp;
        this.titleExpView = exp.titleExp;
      }
    });

  }
  ngAfterViewInit(): void {
    this.header.urlComponent = this.prevUrl;
  }
  redirecWithId() {
    this.router.navigate([`user/confirm-interaction/${this.id}`], {
      queryParamsHandling: "preserve",
    });
  }
}
