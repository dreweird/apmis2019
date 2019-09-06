import { Injectable } from "@angular/core";

import { UserService, DataStoreService, Query  } from  'kinvey-angular-sdk';
import { MatSnackBar } from '@angular/material/snack-bar';

const _CURRENT_USER = "_CURRENT_USER";

export class User {
  email?: string;
  password: string;
}

@Injectable()
export class BackendService {

  collection: any;

    constructor(private userService: UserService, private snackBar: MatSnackBar,
      datastoreService: DataStoreService){
        this.collection = datastoreService.collection('commodity');
    }

    public isUserLoggedIn(): boolean {
      let loggedIn = !!localStorage.getItem("currentUser");
      return loggedIn;
  }



    async login(username: string, password: string) {
        try {
          const user = await this.userService.login(username, password);
         // console.log(user);
            return user;
        } catch (error) {
            this.snackBar.open('Please retry your request with correct credentials', 'Please try again', {
                duration: 3000,
            });
         // console.log(error);
            return null;
        }
    }

      async logout() {
        try {
          localStorage.clear();
          await this.userService.logout();
        } catch (error) {
          console.log(error);
        }
      }

    getData(commodity_name) {
      const query  = new Query();
      query.equalTo('name', commodity_name);
      query.ascending("_kmd.ect");
      return this.collection.find(query);
    }

    deleteData(entity_id){
      return this.collection.removeById(entity_id);
    }



}