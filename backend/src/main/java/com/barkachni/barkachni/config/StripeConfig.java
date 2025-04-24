package com.barkachni.barkachni.config;

import com.stripe.Stripe;
import jakarta.annotation.PostConstruct;
import org.springframework.context.annotation.Configuration;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class StripeConfig {

    @Value("${stripe.api.key}") // Fetch the value from application.properties
    private String apiKey;

    @PostConstruct
    public void init() {
        com.stripe.Stripe.apiKey = apiKey; // Set Stripe's API key globally
    }
}

