import { Control } from 'ol/control';
import PluggableMap from 'ol/PluggableMap';

export class UserLocation extends Control {
  constructor(clickCallback: (m: PluggableMap) => void) {
    const button = document.createElement('button');
    button.type = 'button';
    button.title = 'My location';
    const span = document.createElement('span');
    span.innerText = '\u25ce'; // utf8 bullseye
    button.appendChild(span);

    const element = document.createElement('div');
    element.className = 'user-location ol-unselectable ol-control';
    element.appendChild(button);

    super({
      element
    });

    button.addEventListener('click', () => clickCallback(super.getMap()!), false);
    button.addEventListener('touchstart', () => clickCallback(super.getMap()!), false);
  }
}
