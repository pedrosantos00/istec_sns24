import { CommonModule } from '@angular/common';
import {
  AfterContentInit,
  Component,
  ContentChildren,
  QueryList,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TabComponent } from '../tab/tab.component';

@Component({
    selector: 'app-tabs-container',
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
    templateUrl: './tabs-container.component.html',
    styleUrl: './tabs-container.component.scss'
})
export class TabsContainerComponent implements AfterContentInit {
  @ContentChildren(TabComponent) tabs: QueryList<TabComponent> =
    new QueryList<TabComponent>();

  ngAfterContentInit(): void {
    if (this.tabs.length > 0) {
      this.selectTab(this.tabs.first);
    }
  }

  selectTab(tab: TabComponent) {
    this.tabs.toArray().forEach((tab) => (tab.isActive = false));
    tab.isActive = true;
  }
}
