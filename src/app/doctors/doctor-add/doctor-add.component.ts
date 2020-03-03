import { TimeSlot } from "./../../shared/models/doctor.model";
import { element } from "protractor";
import { Image } from "./../../shared/models/image.model";
import { SpecialityService } from "../../shared/services/speciality.service";
import { Speciality } from "../../shared/models/speciality.model";
import { Location } from "@angular/common";
import { DoctorService } from "./../../shared/services/doctor.service";
import { Component, OnInit, Inject } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators
} from "@angular/forms";
import {
  MatDialogRef,
  MatDialog,
  MAT_DIALOG_DATA
} from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Doctor } from "src/app/shared/models/doctor.model";
import { ActivatedRoute } from "@angular/router";
import { IDropdownSettings } from "ng-multiselect-dropdown";
@Component({
  selector: "app-doctor-add",
  templateUrl: "./doctor-add.component.html",
  styleUrls: ["./doctor-add.component.scss"]
})
export class DoctorAddComponent implements OnInit {
  // dropdownSettings: IDropdownSettings;
  doctor: Doctor;
  subsImage: Image;
  doctorAddForm: FormGroup;
  doctorId: string;
  educationDetails: string[] = [];
  services: string[] = [];
  experiences: string[] = [];
  memberships: string[] = [];
  specializations: string[] = [];
  specialities: Speciality[] = [];
  awards: string[] = [];
  availableOn?: string[] = [];
  isSaving = false;
  dropdownList = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
  timings: TimeSlot[] = [];
  dropdownSettings: IDropdownSettings = {
    singleSelection: false,

    selectAllText: "Select All",
    unSelectAllText: "UnSelect All",
    itemsShowLimit: 7,
    allowSearchFilter: true
  };

  constructor(
    private fb: FormBuilder,
    private doctorService: DoctorService,
    private specialityService: SpecialityService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.doctorId = params.get("id");
      console.log(this.doctorId);
    });

    if (this.doctorId) {
      this.doctorService.getDoctorById(this.doctorId).subscribe(response => {
        this.doctor = response;
        console.log(this.doctor);
        this.populateDoctorModal();
      });
    }

    this.getSpecialization();

    this.doctorAddForm = this.fb.group({
      name: ["", Validators.required],
      mobileNumber: ["", Validators.required],
      address: new FormControl(""),
      city: [""],
      email: new FormControl(""),
      state: new FormControl(""),
      degree: ["", Validators.required],

      commission: new FormControl(""),
      speciality: new FormControl(""),
      regno: new FormControl(""),
      gender: new FormControl(""),
      about: [""],
      yearOfExperience: ["", Validators.required],
      educationDetails: [""],
      services: [""],
      experience: [""],
      memberships: [""],
      specializations: [""],
      awards: [""],
      availableOn: [""],
      morningStartTime: [""],
      morningEndTime: [""],
      afternoonStartTime: [""],
      afternoonEndTime: [""],
      eveningStartTime: [""],
      eveningEndTime: [""],
      nightStartTime: [""],
      nightEndTime: [""],
      consultationFee: ["", Validators.required]
    });
  }

  getSpecialization() {
    this.specialityService.getSpeciality().subscribe(res => {
      // console.log(".....................", res);
      this.specialities = res;
    });
  }
  getImageURL(image: Image) {
    console.log("getImageURL", image);
    this.subsImage = image;
  }
  getDoctorDetails() {
    this.timings = [];
    const doctor: Doctor = {
      name: this.doctorAddForm.get("name").value,
      email: this.doctorAddForm.get("email").value,
      mobileNumber: this.doctorAddForm.get("mobileNumber").value,
      address: this.doctorAddForm.get("address").value,
      city: this.doctorAddForm.get("city").value,
      degree: this.doctorAddForm.get("degree").value,
      state: this.doctorAddForm.get("state").value,
      speciality: this.doctorAddForm.get("speciality").value,

      specializations: this.doctorAddForm.get("specializations").value,
      regno: this.doctorAddForm.get("regno").value,
      gender: this.doctorAddForm.get("gender").value,
      yearOfExperience: this.doctorAddForm.get("yearOfExperience").value,
      about: this.doctorAddForm.get("about").value,
      availableOn: this.doctorAddForm.get("availableOn").value,
      consultationFee: this.doctorAddForm.get("consultationFee").value
    };
    doctor.educationDetails = this.educationDetails;
    doctor.services = this.services;
    doctor.experiences = this.experiences;
    doctor.memberships = this.memberships;
    doctor.specializations = this.specializations;
    doctor.awards = this.awards;
    if (this.subsImage) {
      doctor.subsImage = this.subsImage;
    }

    const timeSlot1: TimeSlot = {
      slot: "Morning",
      startTime: this.doctorAddForm.get("morningStartTime").value,
      endTime: this.doctorAddForm.get("morningEndTime").value
    };
    this.timings.push(timeSlot1);

    const timeSlot2: TimeSlot = {
      slot: "AfterNoon",
      startTime: this.doctorAddForm.get("afternoonStartTime").value,
      endTime: this.doctorAddForm.get("afternoonEndTime").value
    };
    this.timings.push(timeSlot2);
    const timeSlot3: TimeSlot = {
      slot: "Evening",
      startTime: this.doctorAddForm.get("eveningStartTime").value,
      endTime: this.doctorAddForm.get("eveningEndTime").value
    };
    this.timings.push(timeSlot3);
    const timeSlot4: TimeSlot = {
      slot: "Night",
      startTime: this.doctorAddForm.get("nightStartTime").value,
      endTime: this.doctorAddForm.get("nightEndTime").value
    };
    this.timings.push(timeSlot4);

    doctor.timings = this.timings;
    console.log(doctor.timings);
    return doctor;
  }

  saveDoctor() {
    const doctor = this.getDoctorDetails();

    if (doctor.name && doctor.mobileNumber) {
      this.isSaving = true;

      if (this.doctorId == "new") {
        this.doctorService.setDoctor(doctor).then(() => {
          this.isSaving = false;
          const message = "New Doctor Added!";
          this.snackBar.open(message, " ", { duration: 2000 });
        });
      } else {
        console.log(doctor);
        doctor.id = this.doctorId;
        this.doctorService.updateDoctor(doctor).then(() => {
          this.isSaving = false;
          const message = "Doctor Updated!";
          this.snackBar.open(message, " ", { duration: 2000 });
        });
      }
    } else if (!doctor.mobileNumber) {
      this.doctorAddForm.get("mobileNumber").markAllAsTouched();
    } else if (!doctor.name) {
      this.doctorAddForm.get("name").markAllAsTouched();
    }
  }

  populateDoctorModal() {
    if (this.doctor) {
      this.doctorAddForm.patchValue({
        name: this.doctor.name,
        mobileNumber: this.doctor.mobileNumber,
        address: this.doctor.address,
        city: this.doctor.city,
        email: this.doctor.email,
        state: this.doctor.state,
        speciality: this.doctor.speciality,

        degree: this.doctor.degree,
        regno: this.doctor.regno,
        gender: this.doctor.gender,
        yearOfExperience: this.doctor.yearOfExperience,
        about: this.doctor.about,
        availableOn: this.doctor.availableOn,
        consultationFee: this.doctor.consultationFee
      });
      console.log("....", this.doctor.timings);
      this.timings = this.doctor.timings;
      this.timings.forEach(time => {
        if (time.slot == "Morning") {
          this.doctorAddForm.patchValue({
            morningStartTime: time.startTime,
            morningEndTime: time.endTime
          });
        } else if (time.slot == "AfterNoon") {
          this.doctorAddForm.patchValue({
            afternoonStartTime: time.startTime,
            afternoonEndTime: time.endTime
          });
        } else if (time.slot == "Evening") {
          this.doctorAddForm.patchValue({
            eveningStartTime: time.startTime,
            eveningEndTime: time.endTime
          });
        }
        if (time.slot == "Night") {
          this.doctorAddForm.patchValue({
            nightStartTime: time.startTime,
            nightEndTime: time.endTime
          });
        }
      });

      this.subsImage = this.doctor.subsImage;
      this.educationDetails = this.doctor.educationDetails;
      this.services = this.doctor.services;
      this.experiences = this.doctor.experiences;
      this.memberships = this.doctor.memberships;
      this.specializations = this.doctor.specializations;
      this.awards = this.doctor.awards;
    }
  }

  onNoClick(): void {
    this.location.back();
  }
  addEducation(element: string) {
    this.educationDetails.push(element);
    this.doctorAddForm.patchValue({
      educationDetails: ""
    });
  }
  deleteEducation(element) {
    var index = this.educationDetails.indexOf(element);
    this.educationDetails.splice(index, 1);
  }
  addServices(element: string) {
    this.services.push(element);
    this.doctorAddForm.patchValue({
      services: ""
    });
  }
  deleteServices(element) {
    var index = this.services.indexOf(element);
    this.services.splice(index, 1);
  }
  addExperience(element: string) {
    this.experiences.push(element);
    this.doctorAddForm.patchValue({
      experience: ""
    });
  }
  deleteExperience(element) {
    var index = this.experiences.indexOf(element);
    this.experiences.splice(index, 1);
  }
  //Specializations  specializations
  addMembership(element: string) {
    this.memberships.push(element);
    this.doctorAddForm.patchValue({
      memberships: ""
    });
  }
  deleteMembership(element) {
    var index = this.memberships.indexOf(element);
    this.memberships.splice(index, 1);
  }
  addSpecialization(element: string) {
    this.specializations.push(element);
    this.doctorAddForm.patchValue({
      specializations: ""
    });
  }
  deleteSpecialization(element) {
    var index = this.specializations.indexOf(element);
    this.specializations.splice(index, 1);
  }
  addAwards(element: string) {
    this.awards.push(element);
    this.doctorAddForm.patchValue({
      awards: ""
    });
  }
  deleteAwards(element) {
    var index = this.awards.indexOf(element);
    this.awards.splice(index, 1);
  }
}
