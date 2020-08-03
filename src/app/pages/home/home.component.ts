import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { PaymentService } from 'src/app/services/payment/payment.service';
import Swal from 'sweetalert2';

declare let paypal: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, AfterViewChecked {
  addScript: boolean = false;
  paypalLoad: boolean = true;

  finalAmount: number = 1;

  paypalConfig = {
    env: 'sandbox',
    client: {
      sandbox:
        'AZyKvhuTI9EC6ckfPDyfL7PrH4csnolcYelT4oWIgIP8CjvBQaJqs5VN2vtnX-90YUsS0LZq4pYyOouq',
    },
    locale: 'en_US',
    style: {
      size: 'medium',
      color: 'black',
      shape: 'rect',
      tagline: true
    },
    // Enable Pay Now checkout flow (optional)
    commit: true,
    // Set up a payment
    payment: (data, actions) => {
      return actions.payment.create({
        payment: {
          transactions: [
            { amount: { total: this.finalAmount, currency: 'INR' } },
          ],
        },
      });
    },
    onAuthorize: (data, actions) => {
      return actions.payment.execute().then((payment) => {
        //Do something when payment is successful.
        Swal.fire({
          title: 'Payment successful',
          icon: 'success',
        });
      });
    },
    onError: function (err) {
      // Show an error page here, when an error occurs
      Swal.fire({
        title: 'Transaction failed! Please try again.',
        icon: 'success',
      });
    },
  };

  constructor(private paymentService: PaymentService) {}

  ngOnInit(): void {}
  ngAfterViewChecked(): void {
    if (!this.addScript) {
      this.addPaypalScript().then(() => {
        paypal.Button.render(this.paypalConfig, '#paypal-checkout-btn');
        this.paypalLoad = false;
      });
    }
  }

  addPaypalScript() {
    this.addScript = true;
    return new Promise((resolve, reject) => {
      let scripttagElement = document.createElement('script');
      scripttagElement.src = 'https://www.paypalobjects.com/api/checkout.js';
      scripttagElement.onload = resolve;
      document.body.appendChild(scripttagElement);
    });
  }
}
