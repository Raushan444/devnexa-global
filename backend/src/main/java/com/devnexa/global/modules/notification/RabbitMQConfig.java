package com.devnexa.global.modules.notification;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    public static final String DEV_EXCHANGE = "devnexa.exchange";
    public static final String DLX_EXCHANGE = "devnexa.dlx";

    public static final String EMAIL_QUEUE = "devnexa.email.queue";
    public static final String NOTIFICATION_QUEUE = "devnexa.notification.queue";
    public static final String DLQ_QUEUE = "devnexa.dlq.queue";

    public static final String EMAIL_ROUTING_KEY = "devnexa.email";
    public static final String NOTIFICATION_ROUTING_KEY = "devnexa.notification";
    public static final String DLQ_ROUTING_KEY = "devnexa.dlq";

    @Bean
    public TopicExchange devExchange() {
        return new TopicExchange(DEV_EXCHANGE);
    }

    @Bean
    public TopicExchange dlxExchange() {
        return new TopicExchange(DLX_EXCHANGE);
    }

    @Bean
    public Queue emailQueue() {
        return QueueBuilder.durable(EMAIL_QUEUE)
                .withArgument("x-dead-letter-exchange", DLX_EXCHANGE)
                .withArgument("x-dead-letter-routing-key", DLQ_ROUTING_KEY)
                .build();
    }

    @Bean
    public Queue notificationQueue() {
        return QueueBuilder.durable(NOTIFICATION_QUEUE)
                .withArgument("x-dead-letter-exchange", DLX_EXCHANGE)
                .withArgument("x-dead-letter-routing-key", DLQ_ROUTING_KEY)
                .build();
    }

    @Bean
    public Queue dlqQueue() {
        return QueueBuilder.durable(DLQ_QUEUE).build();
    }

    @Bean
    public Binding emailBinding(Queue emailQueue, TopicExchange devExchange) {
        return BindingBuilder.bind(emailQueue).to(devExchange).with(EMAIL_ROUTING_KEY);
    }

    @Bean
    public Binding notificationBinding(Queue notificationQueue, TopicExchange devExchange) {
        return BindingBuilder.bind(notificationQueue).to(devExchange).with(NOTIFICATION_ROUTING_KEY);
    }

    @Bean
    public Binding dlqBinding(Queue dlqQueue, TopicExchange dlxExchange) {
        return BindingBuilder.bind(dlqQueue).to(dlxExchange).with(DLQ_ROUTING_KEY);
    }

    @Bean
    public Jackson2JsonMessageConverter messageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory) {
        RabbitTemplate template = new RabbitTemplate(connectionFactory);
        template.setMessageConverter(messageConverter());
        return template;
    }
}
