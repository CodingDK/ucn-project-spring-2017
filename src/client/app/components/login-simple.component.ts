import { Component, OnInit } from '@angular/core';
import { IMultiSelectTexts, IMultiSelectSettings, IMultiSelectOption } from "angular-2-dropdown-multiselect";
import { UserService } from "../services/user.service";
import { AuthService } from "../services/auth.service";
import { Router } from "@angular/router";
import { ToastyService } from "ng2-toasty";

@Component({
  selector: 'login-simple',
  templateUrl: 'login-simple.component.html',
  styleUrls: ['login-simple.component.scss']
})
export class LoginSimpleComponent implements OnInit {

  selectedArr: any = [];

  texts: IMultiSelectTexts = {
    checkAll: 'Vælge alle',
    uncheckAll: 'Fjern alle',
    checked: `1 valgt`,
    checkedPlural: `1 valgt`,
    searchPlaceholder: 'Find',
    defaultTitle: 'Vælg',
    allSelected: 'Alle valgt',
  };
  settings: IMultiSelectSettings = {
    checkedStyle: 'fontawesome',
    buttonClasses: 'btn btn-default btn-block btn-select',
    dynamicTitleMaxItems: 2,
    selectionLimit: 1,
    displayAllSelectedText: true,
    containerClasses: '',
    autoUnselect: true,
    closeOnSelect: true
  };
  options: IMultiSelectOption[] = [{ name: "name", id: "id" }, { name: "name1", id: "id1" }, { name: "name2", id: "id2" }];

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    private toastyService: ToastyService) {

  }

  ngOnInit(): void {
    this.userService.getAllUsers().then(users => {
      this.options = users.map((user) => {
        const nameValue = `${user.name} (${user.roles.join(", ")})`;
        return <IMultiSelectOption>{
          id: user.id,
          name: nameValue
        };
      });
    });
  }

  submit() {
    this.authService.loginSimple(this.selectedArr[0])
      .catch(err => {
        let errorMessage;
        try {
          errorMessage = JSON.parse(err._body).message;
        } catch (e) {
          errorMessage = `Unknown Error - code: ${err.status} - ${err.statusText}`;
        }
        this.toastyService.error(errorMessage);
      });
  }
}
