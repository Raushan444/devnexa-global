package com.devnexa.global.modules.portal;

import com.devnexa.global.modules.portal.Milestone;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MilestoneRepository extends JpaRepository<Milestone, Long> {
    List<Milestone> findByProjectIdOrderByDisplayOrderAsc(Long projectId);
}
