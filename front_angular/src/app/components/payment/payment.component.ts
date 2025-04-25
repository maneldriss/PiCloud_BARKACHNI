import { Component } from '@angular/core';
 // Import CommandeService
import { loadStripe } from '@stripe/stripe-js';
import { ActivatedRoute, Router } from '@angular/router'; // Import Router
import { CommandeService } from 'src/app/services/commande.service';
import { PaymentService } from 'src/app/services/payment.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css'],
})
export class PaymentComponent {
  amount: number = 1000; // in cents
  currency: string = 'usd';
  errorMessage: string = '';
  isLoading: boolean = false;
  stripe: any;
  card: any;
  commandeId: number | null = null; // To hold the commandeId

  constructor(
    private paymentService: PaymentService,
    private commandeService: CommandeService, // Inject CommandeService
    private route: ActivatedRoute,
    private router: Router // For navigation
  ) {}

  async ngOnInit(): Promise<void> {
    this.stripe = await loadStripe(
      'pk_test_51RDX4lHGLlrdD1MdqoYqOtvxtBG2M4eoeZZw7rgEuwF8jvnMvUKBT2Gp66rowS70WSZgD92azJklEkSRYC9GQHPU00FGvNnAz1'
    );

    // Extract `total` and `commandeId` from query params
    this.route.queryParams.subscribe((params) => {
      if (params['total']) {
        this.amount = params['total'] ; // Convert to cents
      }
      if (params['commandeId']) {
        this.commandeId = +params['commandeId'];
      }
    });

    // Set up Stripe Elements
    const elements = this.stripe.elements();
    this.card = elements.create('card');
    this.card.mount('#card-element');
  }

  async submitPaymentForm(event: Event): Promise<void> {
    event.preventDefault();
    this.isLoading = true;
    this.errorMessage = '';

    try {
      // 1. Create Payment Intent
      const response: any = await this.paymentService
        .createPaymentIntent(this.amount, this.currency)
        .toPromise();

      if (!response.clientSecret) {
        throw new Error('No client secret received');
      }

      // 2. Confirm Payment with Stripe
      const { error, paymentIntent } = await this.stripe.confirmCardPayment(
        response.clientSecret,
        {
          payment_method: {
            card: this.card,
          },
        }
      );

      if (error) {
        throw error;
      }

      if (paymentIntent.status === 'succeeded') {
        alert('Payment successful!');
        // Update payment status to "Paid"
        this.updatePaymentStatus();
      }
    } catch (err: any) {
      this.errorMessage = err.message || 'Payment failed';
      console.error('Payment error:', err);
    } finally {
      this.isLoading = false;
    }
  }

  updatePaymentStatus(): void {
    if (this.commandeId) {
      this.commandeService.updatePaymentStatus(this.commandeId, 'Paid').subscribe({
        next: () => {
          console.log('Payment status updated to Paid');
          this.router.navigate(['/commande']); // Navigate to commandes page
        },
        error: (err) => console.error('Failed to update payment status:', err),
      });
    } else {
      console.error('Commande ID is missing, cannot update payment status.');
    }
  }
}
