import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { HomeComponent } from "./home/home.component";
import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
import { FormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { LayoutModule } from "@angular/cdk/layout";
import { MaterialModule } from "./material.module";
import { TimetableComponent } from "./home/timetable.component";
import { SubjectService } from "./subject.service";
import { ChooserComponent } from "./home/chooser.component";
import { SelectedService } from "./home/selected.service";

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    LayoutModule,
    MaterialModule
  ],
  declarations: [
    AppComponent,
    HomeComponent,
    TimetableComponent,
    ChooserComponent
  ],
  providers: [SubjectService, SelectedService],
  bootstrap: [AppComponent]
})
export class AppModule {}
