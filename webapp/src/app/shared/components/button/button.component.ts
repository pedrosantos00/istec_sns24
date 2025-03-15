import { Component, EventEmitter, input, Input, Output } from '@angular/core';

@Component({
    selector: 'app-button',
    imports: [],
    templateUrl: './button.component.html',
    styleUrl: './button.component.scss'
})
export class ButtonComponent {
  @Input() type: string = 'button';
  @Input() bgColor = 'bg-blue-500';
  @Input() disabled = false;
  @Input() bgHover = 'hover:bg-blue-600';
  @Input() color = 'text-white';
}
