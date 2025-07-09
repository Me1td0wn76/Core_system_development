package com.example.coresystem;

import org.springframework.boot.test.context.TestConfiguration;
//import org.testcontainers.utility.DockerImageName;

@TestConfiguration(proxyBeanMethods = false)
class TestcontainersConfiguration {

	// @Bean
	// @ServiceConnection
	// MySQLContainer<?> mysqlContainer() {
	// return new MySQLContainer<>(DockerImageName.parse("mysql:latest"));
	// }

}
