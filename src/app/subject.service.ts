import { Injectable } from "@angular/core";
import { SUBJECTS } from "./subjects";
import { Subject } from "./subject";

@Injectable({
  providedIn: "root"
})
export class SubjectService {
  constructor() {}
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
