import { UserService } from "./../../shared/services/user.service";
import { User } from "./../../shared/models/user.model";
import { Component, OnInit } from "@angular/core";

import { Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { UserAddComponent } from "../user-add/user-add.component";

@Component({
  selector: "app-user-details",
  templateUrl: "./user-details.component.html",
  styleUrls: ["./user-details.component.scss"]
})
export class UserDetailsComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  totalUsers: number;
  isLoading = false;

  constructor(
    private router: Router,
    public dialog: MatDialog,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.fetchUsers();
  }
  addNewUser() {
    // this.router.navigate(["user/new"]);
  }
  fetchUsers() {
    this.isLoading = true;
    this.userService.getUsers().subscribe(response => {
      this.users = response;
      this.isLoading = false;
      this.filteredUsers = response;
      this.totalUsers = this.users.length;
    });
  }
  openUserAddDialog(id) {
    const dialogRef = this.dialog.open(UserAddComponent, {
      width: "500px",
      maxWidth: "100vw",
      data: { id: id }
    });

    dialogRef.afterClosed().subscribe(response => {
      this.fetchUsers();
    });
  }
  editDoc(id) {
    this.openUserAddDialog(id);
  }
  applyFilter(filterValue: string) {
    console.log(filterValue);
    this.filteredUsers = this.users.filter(user => {
      if (!filterValue) {
        return true;
      } else if (
        user.name
          .trim()
          .toLowerCase()
          .includes(filterValue.trim().toLowerCase())
      ) {
        return true;
      } else if (
        user.email
          .trim()
          .toLowerCase()
          .includes(filterValue.trim().toLowerCase())
      ) {
        return true;
      } else {
        return false;
      }
    });
  }
}
