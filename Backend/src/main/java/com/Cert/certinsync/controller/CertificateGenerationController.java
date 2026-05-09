package com.Cert.certinsync.controller;

import com.Cert.certinsync.entity.ParticipantCertificate;
import com.Cert.certinsync.entity.TemplateEntity;
import com.Cert.certinsync.repository.CertificateRepository;
import com.Cert.certinsync.service.CertificateService;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.Map;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/certificates")
@CrossOrigin
public class CertificateGenerationController {

    private static final Logger logger = LoggerFactory.getLogger(CertificateGenerationController.class);

    @Autowired
    private CertificateService certificateService;
    @Autowired
    private CertificateRepository certificateRepository;

    @PostMapping("/generate")
    public ResponseEntity<?> generateCertificates(
            @RequestParam Long templateId,
            @RequestParam("csvFile") MultipartFile csvFile,
            @RequestParam(required = false) String fieldMappings) {
        logger.info("Received request to generate certificates for templateId: {}", templateId);
        try {
            TemplateEntity template = certificateService.getTemplateById(templateId);
            if (template == null) {
                return ResponseEntity.badRequest().body("Template with ID " + templateId + " not found.");
            }

            Map<String, String> mappings = null;
            if (fieldMappings != null && !fieldMappings.isEmpty()) {
                ObjectMapper mapper = new ObjectMapper();
                mappings = mapper.readValue(fieldMappings, new TypeReference<Map<String, String>>() {});
            }

            // Delegate to service layer
            byte[] zipBytes = certificateService.generateCertificates(templateId, csvFile, mappings);

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

    @PutMapping("/{id}")
    public ResponseEntity<?> updateCertificate(@PathVariable Long id, @RequestBody Map<String, String> updatedData) {
        try {
            byte[] pdf = certificateService.updateAndRegenerateCertificate(id, updatedData);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=corrected_certificate.pdf")
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(pdf);
        } catch (Exception e) {
            logger.error("Error updating certificate {}: ", id, e);
            return ResponseEntity.internalServerError().body("Error updating certificate: " + e.getMessage());
        }
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<?> downloadCertificate(@PathVariable Long id) {
        try {
            ParticipantCertificate pc = certificateRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Certificate not found"));
            
            TemplateEntity template = certificateService.getTemplateById(pc.getTemplateId());
            
            ObjectMapper mapper = new ObjectMapper();
            Map<String, String> data = mapper.readValue(pc.getParticipantData(), new TypeReference<Map<String, String>>() {});
            data.put("certificateId", pc.getCertificateId());

            String svgWithId = com.Cert.certinsync.utils.SvgUtils.insertCertificateId(template.getSvgContent(), pc.getCertificateId());
            String personalizedSvg = com.Cert.certinsync.utils.SvgUtils.replacePlaceholders(svgWithId, data);
            byte[] pdf = com.Cert.certinsync.utils.SvgUtils.convertSvgToPdf(personalizedSvg);

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + pc.getName().replace(" ", "_") + ".pdf")
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(pdf);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error downloading certificate: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCertificate(@PathVariable Long id) {
        certificateService.deleteCertificate(id);
        return ResponseEntity.noContent().build();
    }
}
