import { Component } from '@angular/core';
import { faMapMarkedAlt, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent {
  public isCollapsed = true;
  public mapIcon = faMapMarkedAlt;
  public aboutIcon = faInfoCircle;
  public githubIcon = faGithub;

  public toggle() {
    this.isCollapsed = !this.isCollapsed;
  }

  public collapse() {
    this.isCollapsed = true;
  }
}
