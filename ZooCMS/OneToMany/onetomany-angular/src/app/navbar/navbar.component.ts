import { Component, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  @ViewChild('navbarNav', { static: false }) navbarNav!: ElementRef;

  collapseNavbar() {
    const navbar = this.navbarNav.nativeElement;
    if (navbar.classList.contains('show')) {
      // Bootstrap 5 uses Collapse from bootstrap JS
      // @ts-ignore
      const collapse = bootstrap.Collapse.getInstance(navbar) || new bootstrap.Collapse(navbar);
      collapse.hide();
    }
  }
}