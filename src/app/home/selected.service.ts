import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root"
})
// TODO: RxJS
export class SelectedService {
  selected: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  constructor() {}

  addSelected({ id, selected }, gened = null) {
    this.removeSelected(id, selected);
    const subject = !gened
      ? { subject: id, section: selected }
      : { subject: id, section: selected, gened };
    const newArr: any[] = [...this.selected.value, subject];
    this.selected.next(newArr);
  }

  removeSelected(subject, section) {
    const newArr = this.selected.value.filter(e => {
      return e.subject !== subject;
    });
    this.selected.next(newArr);
  }

  getSelected() {
    return this.selected;
  }
}
