import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-captcha',
  templateUrl: './captcha.component.html',
  styleUrls: ['./captcha.component.scss'],
})
export class CaptchaComponent implements OnInit {

  @Input() showError;
  @Input()set restart(res: boolean) { if ( res ) { this.initCaptcha(); } }
  @Output('status') statusEmitter = new EventEmitter();

  private defaultObj = { value: -1, icon: '', title: '' };
  private indexAnswer: number;
  public userAnswer;
  public captchaAnswer;
  public userCaptcha = { question: null , answers: [] };
  private captchaQuestions;
  private getQuestions() {
    return [
      { value: 0, icon: 'home', title: 'la Casa' },
      { value: 1, icon: 'airplanemode_on', title: 'el Avión' },
      { value: 2, icon: 'accessibility', title: 'la Persona' },
      { value: 3, icon: 'camera_alt', title: 'la Camara' },
      { value: 4, icon: 'airport_shuttle', title: 'el Bus' },
      { value: 5, icon: 'beach_access', title: 'la Sombrilla' },
      { value: 6, icon: 'cake', title: 'el Pastel' },
      { value: 7, icon: 'insert_emoticon', title: 'la Cara Feliz' },
      { value: 8, icon: 'brush', title: 'el Pincel' },
      { value: 9, icon: 'construction', title: 'las Herramientas' },
      { value: 10, icon: 'cloud', title: 'la Nube' },
      { value: 11, icon: 'content_cut', title: 'la Tijera' },
      { value: 12, icon: 'create', title: 'el Lápiz' },
      { value: 13, icon: 'two_wheeler', title: 'la Motocicleta' },
      { value: 14, icon: 'emoji_objects', title: 'el Bombillo' },
      { value: 15, icon: 'favorite', title: 'el Corazón' },
      { value: 16, icon: 'flash_on', title: 'el Rayo' },
      { value: 17, icon: 'notifications', title: 'la Campana' },
      { value: 18, icon: 'restaurant', title: 'los Cubiertos' },
      { value: 19, icon: 'smoking_rooms', title: 'el Cigarrillo' },
      { value: 20, icon: 'watch', title: 'el Reloj' }
    ];
  }

  constructor() { }

  ngOnInit() {
    this.initCaptcha();
  }

  public initCaptcha() {
    this.userAnswer = this.defaultObj;
    this.captchaAnswer = this.defaultObj;
    this.userCaptcha.question = null;
    this.userCaptcha.answers = [];
    this.captchaQuestions = this.getQuestions();

    //Avoid same answer
    let questions = this.captchaQuestions;

    let iq = Math.floor(Math.random() * questions.length);
    while ( this.indexAnswer == iq ) {
      iq = Math.floor(Math.random() * questions.length);
    }
    this.indexAnswer = iq;
    this.captchaAnswer = questions[this.indexAnswer];
    this.userCaptcha.answers.push( this.captchaAnswer );

    questions.splice( iq, 1 );
    for( let i = 0; i < 3; i++) {
      iq = Math.floor( Math.random() * questions.length );
      this.userCaptcha.answers.push( questions[iq] );
      questions.splice( iq, 1 );
    }

    this.userCaptcha.answers = this.userCaptcha.answers.sort( () => Math.random() - 0.5);
    this.userCaptcha.question = "Seleccione " + this.captchaAnswer.title;
  }

  public checkCaptcha( answer ) {
    this.userAnswer = answer;
    this.statusEmitter.emit( this.captchaAnswer.value == this.userAnswer.value );
  }

}
