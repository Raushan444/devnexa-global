package com.devnexa.global;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication(exclude = {
    org.springframework.boot.autoconfigure.amqp.RabbitAutoConfiguration.class
})
@EnableAsync
@EnableScheduling
public class DevNexaApplication {
        public static void main(String[] args) {
        SpringApplication.run(DevNexaApplication.class, args);
    }
}
