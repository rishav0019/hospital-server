import { AppointmentService } from "./../../shared/services/appointment.service";
import { Appointment } from "./../../shared/models/appointment.model";
import { Component, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { SaveDialogComponent } from "src/app/shared/components/save-dialog/save-dialog.component";
import {
  trigger,
  state,
  style,
  transition,
  animate
} from "@angular/animations";

@Component({
  selector: "app-appointment-details",
  templateUrl: "./appointment-details.component.html",
  styleUrls: ["./appointment-details.component.scss"],
  animations: [
    trigger("detailExpand", [
      state("collapsed", style({ height: "0px", minHeight: "0" })),
      state("expanded", style({ height: "*" })),
      transition(
        "expanded <=> collapsed",
        animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)")
      )
    ])
  ]
})
export class AppointmentDetailsComponent implements OnInit {
  appointments: Appointment[] = [];
  date = new FormControl(new Date());
  serializedDate = new Date();
  columnsToDisplay = [
    "bookingId",
    "patientName",
    "patientMobile",
    "dateSlot",
    "timeSlot",
    "patientCity",

    "doctorName",

    "action"
  ];
  expandedElement: Appointment | null;
  constructor(
    private appointmentService: AppointmentService,
    public dialog: MatDialog // private orderService: OrderService, // private sidenavService: SidenavService
  ) {}

  ngOnInit() {
    this.serializedDate = new Date(new Date().setHours(0, 0, 0, 0));
    this.getAppointmentByDate(this.serializedDate);
    // this.getAppointments();
  }
  getAppointments() {
    this.appointmentService.getAppointments().subscribe(response => {
      this.appointments = response;
      console.log("appointments", response);
    });
  }
  getAppointmentByDate(value) {
    this.appointmentService.getAppointmentByDate(value).subscribe(response => {
      this.appointments = response;
      console.log("dateSlot", response);
    });
  }

  updateStatus(deliveryStatus, delivery: Appointment) {
    const dialogRef = this.dialog.open(SaveDialogComponent, {
      width: "250px",
      data: "Are you sure to update?"
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(result);
        // delivery.subsItem = {};
        // delivery.deliveryStatus = deliveryStatus;
        this.appointmentService.updateAppointment(delivery);
      } else {
        console.log(result);

        this.serializedDate = new Date(
          new Date(this.date.value).setHours(0, 0, 0, 0)
        );
        this.getAppointmentByDate(this.serializedDate);
      }
    });
  }
}
