package com.bakery.app;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class BakeryAppApplication {

	public static void main(String[] args) {
		SpringApplication.run(BakeryAppApplication.class, args);
	}

}
