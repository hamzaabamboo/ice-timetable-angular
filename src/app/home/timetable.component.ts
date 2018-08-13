import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { Timetable, Renderer } from "../../lib/timetable";
import { SelectedService } from "./selected.service";
const DATES = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
@Component({
  selector: "app-timetable",
  templateUrl: "./timetable.component.html",
  styleUrls: ["../../lib/timetable.sass"],
  encapsulation: ViewEncapsulation.None
})
export class TimetableComponent implements OnInit {
  timetable: Timetable;
  constructor(private selectedService: SelectedService) {}
  ngOnInit() {
    try {
      this.timetable = new Timetable();
      this.timetable.setScope(8, 18);
      this.timetable.addLocations(DATES);
      this.render();
    } catch (error) {
      console.log("lol broke", error);
    }
    this.subscribe();
  }
  render() {
    const renderer = new Renderer(this.timetable);
    renderer.draw(".timetable"); // any css selector
  }
  subscribe() {
    this.selectedService.subscribe();
  }
}
