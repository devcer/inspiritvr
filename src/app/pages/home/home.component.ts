import { Component, OnInit } from '@angular/core';
import { PaymentService } from 'src/app/services/payment/payment.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private paymentService: PaymentService) { }

  ngOnInit(): void {
  }

  makePayment() {
    this.paymentService.createOrder();
  }
}
