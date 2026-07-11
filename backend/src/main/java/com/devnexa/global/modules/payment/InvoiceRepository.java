package com.devnexa.global.modules.payment;

import com.devnexa.global.modules.payment.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
    List<Invoice> findByProjectId(Long projectId);
    
    @Query("SELECT i FROM Invoice i WHERE i.project.client.id = :clientId")
    List<Invoice> findByClientId(@Param("clientId") Long clientId);
}
