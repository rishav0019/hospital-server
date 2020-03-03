import { UserService } from "./../../shared/services/user.service";
import { User } from "./../../shared/models/user.model";
import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import {
  FormBuilder,
  Validators,
  FormControl,
  FormGroup
} from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-user-add",
  templateUrl: "./user-add.component.html",
  styleUrls: ["./user-add.component.scss"]
})
export class UserAddComponent implements OnInit {
  user: User;

  userAddForm: FormGroup;
  userId: string;

  isSaving = false;
  constructor(
    public dialogRef: MatDialogRef<UserAddComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {
    this.userId = data.id;
  }

  ngOnInit() {
    if (this.userId) {
      this.userService.getUserById(this.userId).subscribe(response => {
        this.user = response;
        console.log(this.user);
        this.populateUserModal();
      });
    }

    this.userAddForm = this.fb.group({
      name: ["", Validators.required],
      phoneNumber: ["", Validators.required],
      address: [""],
      city: [""],
      email: [""],
      state: [""],
      age: [""],
      commission: [""],
      specialization: [""],
      gender: [""]
    });
  }

  getUserDetails() {
    const user: User = {
      name: this.userAddForm.get("name").value,
      email: this.userAddForm.get("email").value,
      phoneNumber: this.userAddForm.get("phoneNumber").value,
      address: this.userAddForm.get("address").value,
      age: this.userAddForm.get("age").value,
      city: this.userAddForm.get("city").value,
      gender: this.userAddForm.get("gender").value,
      state: this.userAddForm.get("state").value
    };

    return user;
  }

  populateUserModal() {
    this.userAddForm.patchValue({
      name: this.user.name,
      phoneNumber: this.user.phoneNumber,
      address: this.user.address,
      city: this.user.city,
      email: this.user.email,
      state: this.user.state,
      age: this.user.age,
      gender: this.user.gender
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
