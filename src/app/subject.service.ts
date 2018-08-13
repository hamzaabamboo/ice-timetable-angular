import { Injectable } from "@angular/core";
import { SUBJECTS } from "./subjects";
import { Subject } from "./subject";

@Injectable({
  providedIn: "root"
})
export class SubjectService {
  constructor() {}
  query(subject, section) {
    return SUBJECTS.filter(e => e.id === subject)[0].sections[section];
  }
  getSubjects(): Subject[] {
    return SUBJECTS.map(e => {
      const { id, name, credit, sections } = e;
      const subject: Subject = {
        id,
        name,
        credit,
        sections
      };
      return subject;
    });
  }
}
