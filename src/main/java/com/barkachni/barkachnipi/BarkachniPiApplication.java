package com.barkachni.barkachnipi;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
public class BarkachniPiApplication {

    public static void main(String[] args) {
        SpringApplication.run(BarkachniPiApplication.class, args);
    }

}
