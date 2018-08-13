import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
// TODO: RxJS
export class SelectedService {
  selected: any = [];
  constructor() {}

  addSelected(subject, section) {
    this.removeSelected(subject, section);
    this.selected.push({ subject, section });
  }

  removeSelected(subject, section) {
    this.selected = this.selected.filter(e => {
      return e.subject !== subject;
    });
  }

  subscribe() {
    console.log("Plz subscribe");
  }
  getSelected() {
    return this.selected;
  }
}
