package com.Cert.certinsync.controller;

import com.Cert.certinsync.entity.ParticipantCertificate;
import com.Cert.certinsync.entity.TemplateEntity;
import com.Cert.certinsync.repository.CertificateRepository;
import com.Cert.certinsync.service.CertificateService;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;



@RestController
@RequestMapping("/api/certificates")
public class CertificateGenerationController {

    @Autowired
    private CertificateService certificateService;
    @Autowired
    private CertificateRepository certificateRepository;

    @PostMapping("/generate")
    public ResponseEntity<?> generateCertificates(@RequestParam Long templateId,
                                                  @RequestParam("csvFile") MultipartFile csvFile) {
        try {
            TemplateEntity template = certificateService.getTemplateById(templateId);
            if (template == null) {
                return ResponseEntity.badRequest().body("Template with ID " + templateId + " not found.");
            }

            // Delegate to service layer
            byte[] zipBytes = certificateService.generateCertificates(templateId, csvFile);

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=certificates.zip")
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .body(zipBytes);

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error generating certificates: " + e.getMessage());
        }
    }

    @GetMapping("/verify/{certificateId}")
    public ResponseEntity<?> verifyCertificate(@PathVariable String certificateId) {
        Optional<ParticipantCertificate> cert = certificateRepository.findByCertificateId(certificateId);
        if (cert.isPresent()) {
            return ResponseEntity.ok(cert.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Invalid Certificate ID"));
        }
    }

}
