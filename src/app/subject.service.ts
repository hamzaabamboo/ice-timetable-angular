import { Injectable } from "@angular/core";
import { SUBJECTS } from "./subjects";
import { Subject } from "./subject";

@Injectable({
  providedIn: "root"
})
export class SubjectService {
  constructor() {}
  query(subjectId, sectionId, gened) {
    if (gened) {
      return {
        section: {
          times: [{ time: gened.time, day: "Thu" }]
      },
        name: gened.name
      };
    } else {
      const subject = SUBJECTS.filter(e => e.id === subjectId)[0];
      const section = subject.sections[sectionId];
      return {
        section,
        name: subject.name
      };
    }
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
