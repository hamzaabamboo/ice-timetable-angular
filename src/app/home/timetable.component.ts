import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { Timetable, Renderer } from "../../lib/timetable";
const DATES = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
@Component({
  selector: "app-timetable",
  templateUrl: "./timetable.component.html",
  styleUrls: ["../../lib/timetable.sass"],
  encapsulation: ViewEncapsulation.None
})
export class TimetableComponent implements OnInit {
  ngOnInit() {
    try {
      const timetable = new Timetable();
      timetable.setScope(8, 18);
      timetable.addLocations(DATES);
      const renderer = new Renderer(timetable);
      renderer.draw(".timetable"); // any css selector
    } catch (error) {
      console.log("lol broke", error);
    }
  }
}
