package com.Cert.certinsync.service;

import com.Cert.certinsync.entity.GenerationBatch;
import com.Cert.certinsync.entity.ParticipantCertificate;
import com.Cert.certinsync.repository.BatchRepository;
import com.Cert.certinsync.repository.CertificateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class BatchService {

    @Autowired
    private BatchRepository batchRepository;

    @Autowired
    private CertificateRepository certificateRepository;

    public List<Map<String, Object>> getAllBatchesMetadata() {
        List<Object[]> results = batchRepository.findAllMetadata();
        return convertToMetadataMap(results);
    }

    public List<Map<String, Object>> getBatchesMetadataByUser(String email) {
        List<Object[]> results = batchRepository.findMetadataByUser(email);
        return convertToMetadataMap(results);
    }

    private List<Map<String, Object>> convertToMetadataMap(List<Object[]> results) {
        List<Map<String, Object>> metadataList = new ArrayList<>();
        for (Object[] row : results) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", row[0]);
            map.put("templateName", row[1]);
            map.put("timestamp", row[2]);
            map.put("expiryDate", row[3]);
            map.put("participantCount", row[4]);
            metadataList.add(map);
        }
        return metadataList;
    }

    public GenerationBatch getBatchById(Long id) {
        return batchRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Batch not found with id: " + id));
    }

    @Transactional
    public void deleteBatch(Long id) {
        batchRepository.deleteById(id);
    }

    public List<ParticipantCertificate> getCertificatesByBatchId(Long batchId) {
        return certificateRepository.findByBatchId(batchId);
    }

    public ParticipantCertificate getCertificateById(Long id) {
        return certificateRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Certificate not found with id: " + id));
    }

    @Transactional
    public void cleanupExpiredBatches() {
        batchRepository.deleteByExpiryDateBefore(LocalDateTime.now());
    }
}
