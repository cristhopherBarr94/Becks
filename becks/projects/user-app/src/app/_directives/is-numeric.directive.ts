import { Directive, Input, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appIsNumeric]'
})
export class IsNumericDirective {

  regexStr = '[0-9]';
  @Input() isNumeric: boolean;

  constructor(private el: ElementRef) { }


  @HostListener('keypress', ['$event']) onKeyPress(event) {
    return new RegExp(this.regexStr).test(event.key);
  }

  @HostListener('paste', ['$event']) blockPaste(event: KeyboardEvent) {
    alert('c');
    this.validateFields(event);
  }

  validateFields(event) {
    setTimeout(() => {
      this.el.nativeElement.value = this.el.nativeElement.value.replace(/[A-Za-z0-9ñÑ ]/g, '').replace(/\s/g, '');
      event.preventDefault();
    }, 1);
  }

}
