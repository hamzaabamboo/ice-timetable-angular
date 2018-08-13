import { NgModule } from "@angular/core";
import { MatListModule } from "@angular/material/list";
import {
  MatToolbarModule,
  MatButtonModule,
  MatSidenavModule,
  MatIconModule,
  MatCardModule,
  MatRadioModule,
  MatExpansionModule
} from "@angular/material";

@NgModule({
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatCardModule,
    MatExpansionModule,
    MatListModule,
    MatRadioModule
  ],
  exports: [
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatCardModule,
    MatExpansionModule,
    MatListModule,
    MatRadioModule
  ]
})
export class MaterialModule {}
