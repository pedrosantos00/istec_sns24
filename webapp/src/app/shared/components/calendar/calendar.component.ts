import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { CalendarEventDto } from '../../dtos/calendarEventDto';
import { Router } from '@angular/router';

@Component({
    selector: 'app-calendar',
    templateUrl: './calendar.component.html',
    imports: [CommonModule],
    styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  @Input() calendarEvents: CalendarEventDto[] = [];

  weeks: any[][] = [];
  currentDate: Date = new Date();
  monthName: string = '';
  year: number = 0;

  constructor(private router: Router) {}

  ngOnInit() {
    this.generateCalendar(this.currentDate);
  }

  generateCalendar(date: Date) {
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    const startDayOfWeek = startOfMonth.getDay();
    const daysInMonth = endOfMonth.getDate();

    this.monthName = startOfMonth.toLocaleString('default', { month: 'long' });
    this.year = startOfMonth.getFullYear();

    const weeks: any[][] = [];
    let currentWeek: any[] = [];

    for (let i = 0; i < (startDayOfWeek === 0 ? 6 : startDayOfWeek - 1); i++) {
      currentWeek.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      currentWeek.push(new Date(date.getFullYear(), date.getMonth(), day));
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }

    while (currentWeek.length < 7) {
      currentWeek.push(null);
    }
    weeks.push(currentWeek);

    this.weeks = weeks;
  }

  getEventsForDay(day: Date): CalendarEventDto[] {
    return this.calendarEvents.filter(
      calendarEvent => day && calendarEvent.date.toDateString() === day.toDateString()
    );
  }

  truncateTitle(title: string, maxLength: number): string {
    return title.length > maxLength ? title.slice(0, maxLength) + '...' : title;
  }

  goToAppointment(id : String){
    this.router.navigate(['/dashboard/appointments/', id]);
  }
}
