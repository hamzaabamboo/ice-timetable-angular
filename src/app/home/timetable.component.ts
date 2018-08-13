import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { Timetable, Renderer } from "../../lib/timetable";
import { SelectedService } from "./selected.service";
import { SubjectService } from "../subject.service";
import * as moment from "moment";

const DATES = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const SHORT_DATES = {
  Mon: DATES[0],
  Tue: DATES[1],
  Wed: DATES[2],
  Thu: DATES[3],
  Fri: DATES[4]
};
@Component({
  selector: "app-timetable",
  templateUrl: "./timetable.component.html",
  styleUrls: ["../../lib/timetable.sass"],
  encapsulation: ViewEncapsulation.None
})
export class TimetableComponent implements OnInit {
  timetable: Timetable;
  constructor(
    private selectedService: SelectedService,
    private subjectService: SubjectService
  ) {}
  ngOnInit() {
    try {
      this.createTimetable([]);
      this.render();
    } catch (error) {
      console.log("lol broke", error);
    }
    this.subscribe();
  }
  onResize(event) {
    this.render();
  }

  createTimetable(data: any[]) {
    this.timetable = new Timetable();
    this.timetable.setScope(8, 18);
    this.timetable.addLocations(DATES);
    data.forEach(subject => {
      subject.section.times.forEach(time => {
        const [start, end] = time.time.split("-");
        const location = time.building
          ? "- " + time.building + " " + time.room
          : "";
        const title = `${subject.name} ${location}`;
        this.timetable.addEvent(
          title,
          SHORT_DATES[time.day],
          moment()
            .hour(parseInt(start.split(":")[0], 10))
            .minute(parseInt(start.split(":")[0], 10))
            .toDate(),
          moment()
            .hour(parseInt(end.split(":")[0], 10))
            .minute(parseInt(end.split(":")[0], 10))
            .toDate()
        );
      });
    });
    this.render();
  }

  render() {
    const renderer = new Renderer(this.timetable);
    renderer.draw(".timetable"); // any css selector
  }
  subscribe() {
    this.selectedService.selected.subscribe(value => {
      this.createTimetable(
        value.map(e => this.subjectService.query(e.subject, e.section, e.gened))
      );
    });
  }
}
