package com.devnexa.global.modules.crm;

import com.devnexa.global.modules.crm.Lead;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LeadRepository extends JpaRepository<Lead, Long> {
    List<Lead> findByStatus(Lead.LeadStatus status);
    List<Lead> findByAssignedToId(Long userId);
}
