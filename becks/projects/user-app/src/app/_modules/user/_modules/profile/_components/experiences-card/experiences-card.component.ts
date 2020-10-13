import { Component, OnInit, Input } from "@angular/core";
import { Router } from '@angular/router';

@Component({
  selector: "user-experiences-card",
  templateUrl: "./experiences-card.component.html",
  styleUrls: ["./experiences-card.component.scss"],
})
export class ExperiencesCardComponent implements OnInit {
  @Input() vertical: boolean;
  @Input() urlImageExperience: string;
  @Input() nameExperience: string;
  @Input() type: string;
  @Input() id: number;

  public typeExp: string;
  public colorClass: string;
  public verticalCard: string;
  constructor(private router: Router) {}

  ngOnInit() {
    if (this.type == "cancel") {
      this.typeExp = "Cancelada";
      this.colorClass = "red-color";
    } else if (this.type == "pending") {
      this.typeExp = "Pendiente";
      this.colorClass = "orange-color";
    } else {
      this.typeExp = "Completa";
      this.colorClass = "green-color";
    }
  }

  redirectExpId() {
    this.router.navigate([`user/exp/${this.id}`], {
      queryParamsHandling: "preserve",
    });
  }

}
