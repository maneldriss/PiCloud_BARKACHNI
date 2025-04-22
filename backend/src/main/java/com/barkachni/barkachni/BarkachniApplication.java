package com.barkachni.barkachni;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableJpaAuditing
@EnableAsync

public class BarkachniApplication {

	public static void main(String[] args) {
		SpringApplication.run(BarkachniApplication.class, args);
	}

}
