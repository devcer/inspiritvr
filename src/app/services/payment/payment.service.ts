import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  paymentServiceUrl = 'https://api.razorpay.com/v1';
  constructor(private http: HttpClient) {}

  createOrder() {
    const url = `${this.paymentServiceUrl}/orders`,
      options = {
        amount: 50,
        currency: 'INR',
        receipt: 'rcptid_11',
        payment_capture: 1,
      };
    this.http.post(url, options).subscribe(data=> {
      debugger;
    }, error => {
      debugger;
    });
  }
}
