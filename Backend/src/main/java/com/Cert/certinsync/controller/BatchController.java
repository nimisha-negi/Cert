package com.Cert.certinsync.controller;

import com.Cert.certinsync.entity.GenerationBatch;
import com.Cert.certinsync.entity.ParticipantCertificate;
import com.Cert.certinsync.service.BatchService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/batches")
@CrossOrigin
public class BatchController {

    private static final Logger logger = LoggerFactory.getLogger(BatchController.class);

    @Autowired
    private BatchService batchService;

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getMyBatches() {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        logger.info("Fetching batches for user: {}", email);
        List<Map<String, Object>> batches = batchService.getBatchesMetadataByUser(email);
        logger.info("Found {} batches for user", batches.size());
        return ResponseEntity.ok(batches);
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<byte[]> downloadBatch(@PathVariable Long id) {
        GenerationBatch batch = batchService.getBatchById(id);
        
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + batch.getTemplateName() + "_certificates.zip\"")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(batch.getZipData());
    }

    @GetMapping("/{id}/certificates")
    public ResponseEntity<List<ParticipantCertificate>> getBatchCertificates(@PathVariable Long id) {
        List<ParticipantCertificate> certs = batchService.getCertificatesByBatchId(id);
        return ResponseEntity.ok(certs);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBatch(@PathVariable Long id) {
        batchService.deleteBatch(id);
        return ResponseEntity.noContent().build();
    }
}
