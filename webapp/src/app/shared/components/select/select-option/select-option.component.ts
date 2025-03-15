import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'app-select-option',
    imports: [CommonModule],
    templateUrl: './select-option.component.html',
    styleUrl: './select-option.component.scss'
})
export class SelectOptionComponent {
  @Input() value: string | number = '';

  constructor() {}

}
