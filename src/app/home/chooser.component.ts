import { Component, OnInit } from "@angular/core";
import { SubjectService } from "../subject.service";
import { Subject } from "../subject";
import { Pipe, PipeTransform } from "@angular/core";
import { SelectedService } from "./selected.service";
@Component({
  selector: "app-chooser",
  templateUrl: "./chooser.component.html",
  styleUrls: ["./chooser.component.css"]
})
export class ChooserComponent implements OnInit {
  subjects: Subject[];
  gened: { name: String; time: String } = {
    name: "",
    time: ""
  };

  constructor(
    private subjectService: SubjectService,
    private selectedService: SelectedService
  ) {}

  getSubjects() {
    this.subjects = this.subjectService.getSubjects();
  }

  getSections(sections): string[] {
    return Object.keys(sections);
  }

  change(stuff, isGened = false) {
    this.selectedService.addSelected(stuff, isGened && this.gened);
  }

  parseSection(section: any, id: string): string {
    return `${id} - ${section.times.reduce(
      (i, e) => `${e.day}, ${e.time};` + i,
      ""
    )} ${section.instructor}`;
  }

  ngOnInit() {
    this.getSubjects();
  }
}
