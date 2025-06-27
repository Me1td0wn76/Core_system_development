package com.example.coresystem;

import org.springframework.boot.SpringApplication;

public class TestCoresystemApplication {

	public static void main(String[] args) {
		SpringApplication.from(CoresystemApplication::main).with(TestcontainersConfiguration.class).run(args);
	}

}
