import { Injectable } from '@angular/core';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  constructor(private userService: UserService) { }

  async isRented(content) {
    const rentedContents: any = await this.userService.getRentedMoviesList();
    if (rentedContents !== undefined && rentedContents !== null && rentedContents?.length > 0) {
      return rentedContents?.find(x => x === content?.movieId) ? true : false;
    } else {
      return false;
    }
  }
}
