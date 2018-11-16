import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'objectPositions'
})
export class ObjectPositionsPipe implements PipeTransform {

  transform(objects : any = []) {
    return Object.values(objects);
  }

}
