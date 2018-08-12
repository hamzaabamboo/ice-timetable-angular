import { Component, OnInit } from "@angular/core";
import { SubjectService } from "../subject.service";
import { Subject } from "../subject";
import { Pipe, PipeTransform } from "@angular/core";
@Component({
  selector: "app-chooser",
  templateUrl: "./chooser.component.html",
  styleUrls: ["../../lib/timetable.sass"]
})
export class ChooserComponent implements OnInit {
  subjects: Subject[];

  constructor(private subjectService: SubjectService) {}

  getSubjects() {
    this.subjects = this.subjectService.getSubjects();
  }

  getSections(sections): string[] {
    return Object.keys(sections);
  }

  parseSection(section: any, id: string): string {
    return `${id} - ${section.times.reduce(
      (i, e) => `${e.day}, ${e.time};` + i,
      ""
    )} ${section.instructor}`;
  }

  ngOnInit() {
    this.getSubjects();
    console.log(this.subjects);
  }
}
