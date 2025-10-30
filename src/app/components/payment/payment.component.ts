import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TransactionService } from '../../services/transaction.service';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  recipientUpiId = '';
  amount: number | null = null;
  notes = '';
  errorMessage = '';
  successMessage = '';
  isLoading = false;
  upiIdError = '';

  constructor(
    private authService: AuthService,
    private transactionService: TransactionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
    }
  }

  validateUpiId(): void {
    this.upiIdError = '';
    if (this.recipientUpiId && !this.transactionService.validateUpiId(this.recipientUpiId)) {
      this.upiIdError = 'Invalid UPI ID format. Example: username@bankname';
    }
  }

  async onSubmit(): Promise<void> {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.recipientUpiId || !this.amount) {
      this.errorMessage = 'Please fill in all required fields.';
      return;
    }

    if (!this.transactionService.validateUpiId(this.recipientUpiId)) {
      this.errorMessage = 'Invalid UPI ID format.';
      return;
    }

    if (this.amount <= 0) {
      this.errorMessage = 'Amount must be greater than zero.';
      return;
    }

    this.isLoading = true;

    const result = await this.transactionService.createTransaction(
      this.recipientUpiId,
      this.amount,
      this.notes
    );

    this.isLoading = false;

    if (result.success) {
      this.successMessage = 'Payment sent successfully!';
      this.recipientUpiId = '';
      this.amount = null;
      this.notes = '';

      setTimeout(() => {
        this.router.navigate(['/transactions']);
      }, 2000);
    } else {
      this.errorMessage = result.error || 'Payment failed.';
    }
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}
