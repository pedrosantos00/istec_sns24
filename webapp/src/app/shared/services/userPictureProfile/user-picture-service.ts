import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { StorageFile } from '../../interfaces/user/storageFile';

@Injectable({
  providedIn: 'root',
})
export class UserPictureService {
  private pictureSource = new BehaviorSubject<string>('assets/img/profile.png');
  currentPicture$ = this.pictureSource.asObservable();

  updatePicture(newPicture: StorageFile | undefined) {
    if (newPicture) {
      const userPictureUrl = `data:${newPicture.mimeType};base64,${newPicture.content}`;
      this.pictureSource.next(userPictureUrl);
    } else {
      this.pictureSource.next('assets/img/profile.png');
    }
  }
}
