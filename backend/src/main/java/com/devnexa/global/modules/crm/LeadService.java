package com.devnexa.global.modules.crm;

import com.devnexa.global.modules.crm.Lead;
import com.devnexa.global.modules.crm.LeadRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class LeadService {

    @Autowired
    private LeadRepository leadRepository;

    public List<Lead> getAllLeads() {
        return leadRepository.findAll();
    }

    public List<Lead> getLeadsByStatus(Lead.LeadStatus status) {
        return leadRepository.findByStatus(status);
    }

    public Optional<Lead> getLeadById(Long id) {
        return leadRepository.findById(id);
    }

    public Lead createLead(Lead lead) {
        return leadRepository.save(lead);
    }

    public Lead updateLead(Long id, Lead updates) {
        Lead lead = leadRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lead not found with id: " + id));
        if (updates.getName() != null) lead.setName(updates.getName());
        if (updates.getEmail() != null) lead.setEmail(updates.getEmail());
        if (updates.getPhone() != null) lead.setPhone(updates.getPhone());
        if (updates.getCompany() != null) lead.setCompany(updates.getCompany());
        if (updates.getStatus() != null) lead.setStatus(updates.getStatus());
        if (updates.getNotes() != null) lead.setNotes(updates.getNotes());
        if (updates.getEstimatedValue() != null) lead.setEstimatedValue(updates.getEstimatedValue());
        if (updates.getSource() != null) lead.setSource(updates.getSource());
        return leadRepository.save(lead);
    }

    public void deleteLead(Long id) {
        leadRepository.deleteById(id);
    }
}
