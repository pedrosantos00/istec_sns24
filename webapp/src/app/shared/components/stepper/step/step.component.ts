import {
  Component,
  Input,
} from '@angular/core';
import { StepConfig } from '../../../interfaces/common/stepper';
import { CommonModule } from '@angular/common';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'app-step',
    imports: [CommonModule],
    templateUrl: './step.component.html',
    styleUrl: './step.component.scss'
})
export class StepComponent {
  @Input() formGroup?: FormGroup;
  @Input() stepConfig: StepConfig = { title: '', icon: '' };
  isVisible: boolean = false;
}
