// Update PaymentService to include clientSecret in the response
package com.example.pi.services;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class PaymentService {

    @Value("${stripe.api.key}")
    private String stripeApiKey;  // Inject the API key from application.properties

    public PaymentIntent createPaymentIntent(Long amount, String currency, String description) throws StripeException {
        // Set your API key
        Stripe.apiKey = stripeApiKey;

        // Create PaymentIntent with the correct parameters
        PaymentIntentCreateParams createParams = PaymentIntentCreateParams.builder()
                .setAmount(amount)  // Amount in cents (1000 = $10.00)
                .setCurrency(currency)
                .setDescription(description)  // Optional: set a description for the payment
                .addPaymentMethodType("card")  // Directly add payment method as a string
                .build();

        // Create the PaymentIntent
        PaymentIntent paymentIntent = PaymentIntent.create(createParams);

        // Return clientSecret to the frontend
        return paymentIntent;
    }
}
