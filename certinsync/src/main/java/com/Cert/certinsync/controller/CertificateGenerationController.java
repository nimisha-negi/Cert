package com.Cert.certinsync.controller;

import com.Cert.certinsync.entity.TemplateEntity;
import com.Cert.certinsync.service.CertificateService;
import com.Cert.certinsync.utils.SvgUtils;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

@RestController
@RequestMapping("/api/certificates")
public class CertificateGenerationController {

    @Autowired
    private CertificateService certificateService;

    @PostMapping("/generate")
    public ResponseEntity<?> generateCertificates(@RequestParam Long templateId,
                                                  @RequestParam("csvFile") MultipartFile csvFile) {
        try {
            TemplateEntity template = certificateService.getTemplateById(templateId);
            if (template == null) {
                return ResponseEntity.badRequest().body("Template with ID " + templateId + " not found.");
            }

            // Parse CSV
            List<Map<String, String>> participants = new ArrayList<>();
            try (CSVParser parser = CSVFormat.DEFAULT.withFirstRecordAsHeader()
                    .parse(new InputStreamReader(csvFile.getInputStream(), StandardCharsets.UTF_8))) {
                for (CSVRecord record : parser) {
                    Map<String, String> data = new HashMap<>();
                    for (String header : parser.getHeaderNames()) {
                        data.put(header, record.get(header));
                    }
                    participants.add(data);
                }
            } catch (Exception e) {
                return ResponseEntity.badRequest().body("Error parsing CSV: " + e.getMessage());
            }

            // Generate PDFs and ZIP
            ByteArrayOutputStream zipOutStream = new ByteArrayOutputStream();
            try (ZipOutputStream zipOut = new ZipOutputStream(zipOutStream)) {
                for (int i = 0; i < participants.size(); i++) {
                    Map<String, String> data = participants.get(i);
                    String personalizedSvg = SvgUtils.replacePlaceholders(template.getSvgContent(), data);
                    byte[] pdfBytes = SvgUtils.convertSvgToPdf(personalizedSvg);

                    String fileName = data.getOrDefault("name", "participant") + ".pdf";
                    ZipEntry entry = new ZipEntry(fileName);
                    zipOut.putNextEntry(entry);
                    zipOut.write(pdfBytes);
                    zipOut.closeEntry();
                }
            }

            byte[] zipBytes = zipOutStream.toByteArray();
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=certificates.zip")
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .body(zipBytes);

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error generating certificates: " + e.getMessage());
        }
    }
}
