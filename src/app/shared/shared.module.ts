import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';

@NgModule({
  imports: [CommonModule, RouterModule, HeaderComponent, FooterComponent],
  exports: [HeaderComponent, FooterComponent],
})
export class SharedModule {}
