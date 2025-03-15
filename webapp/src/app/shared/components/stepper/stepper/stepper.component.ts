import { CommonModule } from '@angular/common';
import {
  AfterContentInit,
  Component,
  ContentChildren,
  EventEmitter,
  Output,
  QueryList,
} from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  heroHome,
  heroInformationCircle,
  heroKey,
  heroUser,
} from '@ng-icons/heroicons/outline';
import { StepComponent } from '../step/step.component';
import { ButtonComponent } from '../../button/button.component';
import { BehaviorSubject, Subject } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-stepper',
  imports: [CommonModule, NgIcon, ButtonComponent],
  viewProviders: [
    provideIcons({ heroUser, heroHome, heroKey, heroInformationCircle }),
  ],
  templateUrl: './stepper.component.html',
  styleUrl: './stepper.component.scss',
})
export class StepperComponent implements AfterContentInit {
  @ContentChildren(StepComponent) steps = new QueryList<StepComponent>();
  currentStep$ = new BehaviorSubject<number>(0);
  @Output() submit = new EventEmitter<boolean>();

  ngAfterContentInit(): void {
    this.currentStep$.subscribe((stepIndex) => {
      this.steps.forEach((stepComponent, index) => {
        stepComponent.isVisible = index === stepIndex;
      });
    });
  }

  nextStep() {
    if (
      this.currentStep === this.steps.length - 1 &&
      this.steps.get(this.currentStep)?.formGroup?.valid
    ) {
      this.submit.emit(true);
      return;
    } else {
      this.steps.get(this.currentStep)?.formGroup?.valid
        ? this.currentStep$.next(this.currentStep + 1)
        : this.steps.get(this.currentStep)?.formGroup?.markAllAsTouched();
    }
  }

  previousStep() {
    this.currentStep$.next(this.currentStep - 1);
  }

  get currentStep(): number {
    return this.currentStep$.value;
  }
}
