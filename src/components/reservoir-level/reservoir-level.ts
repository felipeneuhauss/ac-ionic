import { Component, Input, SimpleChanges } from '@angular/core';

/**
 * Generated class for the ReservoirLevelComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'reservoir-level',
  templateUrl: 'reservoir-level.html'
})
export class ReservoirLevelComponent {

  text: string;

  @Input() reservoir: any;

  constructor() {
    console.log('Hello ReservoirLevelComponent Component');
    this.text = 'Hello World';
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('changes', changes);
  }

  ionViewDidLoad() {
    console.log('reservoir', this.reservoir);
  }

}
