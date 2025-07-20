package com.Cert.certinsync;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
@ComponentScan(basePackages = "com.Cert.certinsync")
@SpringBootApplication
public class CertinsyncApplication {

	public static void main(String[] args) {
		SpringApplication.run(CertinsyncApplication.class, args);
	}

}
