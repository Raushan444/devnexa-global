package com.devnexa.global.modules.newsletter;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NewsletterRepository extends JpaRepository<NewsletterSubscriber, Long> {

    Optional<NewsletterSubscriber> findByEmail(String email);

    List<NewsletterSubscriber> findByStatus(NewsletterSubscriber.SubscriberStatus status);

    boolean existsByEmail(String email);
}
