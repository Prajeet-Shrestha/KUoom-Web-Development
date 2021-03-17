import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-booking-confirmation',
  templateUrl: './booking-confirmation.component.html',
  styleUrls: ['./booking-confirmation.component.css'],
})
export class BookingConfirmationComponent implements OnInit {
  constructor(public dialogref: MatDialogRef<BookingConfirmationComponent>) {}

  ngOnInit(): void {}
}
