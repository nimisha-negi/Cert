package com.Cert.certinsync.service;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.Cert.certinsync.entity.GenerationBatch;
import com.Cert.certinsync.entity.ParticipantCertificate;
import com.Cert.certinsync.entity.TemplateEntity;
import com.Cert.certinsync.repository.BatchRepository;
import com.Cert.certinsync.repository.CertificateRepository;
import com.Cert.certinsync.repository.TemplateRepository;
import com.Cert.certinsync.utils.SvgUtils;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.*;
import java.time.LocalDateTime;
import java.util.*;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

@Service
public class CertificateService {

    @Autowired
    private TemplateRepository templateRepository;

    public TemplateEntity getTemplateById(Long templateId) {
        return templateRepository.findById(templateId).orElse(null);
    }

    @Autowired
    private CertificateRepository certificateRepository;

    @Autowired
    private BatchRepository batchRepository;

    @Autowired
    private com.Cert.certinsync.repository.UserRepository userRepository;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Transactional
    public byte[] generateCertificates(Long templateId, MultipartFile csvFile, Map<String, String> fieldMappings) throws Exception {
        String email = (String) org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        com.Cert.certinsync.entity.User user = userRepository.findByEmail(email).orElse(null);
        
        TemplateEntity template = getTemplateById(templateId);
        List<Map<String, String>> participantData = parseCSV(csvFile);

        List<byte[]> pdfs = new ArrayList<>();
        List<ParticipantCertificate> certificates = new ArrayList<>();

        // Create the batch first so we can link it
        GenerationBatch batch = GenerationBatch.builder()
                .templateName(template.getTemplateName())
                .templateId(templateId)
                .timestamp(LocalDateTime.now())
                .expiryDate(LocalDateTime.now().plusDays(7))
                .participantCount(participantData.size())
                .user(user)
                .build();
        
        batch = batchRepository.save(batch);

        for (Map<String, String> data : participantData) {
            // Step 1: Generate certificate ID
            String certId = UUID.randomUUID().toString().substring(0, 8).toUpperCase();
            
            // Create a copy to add the certId without modifying original data
            Map<String, String> mappedData = new HashMap<>(data);
            mappedData.put("certificateId", certId); 

            // Step 2: Add certificateId to SVG
            String svgWithId = SvgUtils.insertCertificateId(template.getSvgContent(), certId);

            // Step 3: Replace placeholders
            String personalizedSvg;
            if (fieldMappings != null && !fieldMappings.isEmpty()) {
                personalizedSvg = SvgUtils.replacePlaceholdersWithMapping(svgWithId, mappedData, fieldMappings);
            } else {
                personalizedSvg = SvgUtils.replacePlaceholders(svgWithId, mappedData);
            }

            // Step 4: Convert to PDF
            byte[] pdf = SvgUtils.convertSvgToPdf(personalizedSvg);
            pdfs.add(pdf);

            // Step 5: Save in DB (Try to find Name and Email automatically)
            String participantName = findValue(data, "name", "full name", "participant");
            String participantEmail = findValue(data, "email", "mail", "email id");

            ParticipantCertificate pc = ParticipantCertificate.builder()
                    .name(participantName)
                    .email(participantEmail)
                    .templateName(template.getTemplateName())
                    .templateId(templateId)
                    .participantData(objectMapper.writeValueAsString(data))
                    .certificateId(certId)
                    .issuedDate(LocalDateTime.now())
                    .batch(batch)
                    .build();

            certificates.add(pc);
            certificateRepository.save(pc); // Explicitly save each certificate
        }

        byte[] zipData = zipPdfs(pdfs, participantData);
        batch.setZipData(zipData);
        
        // Final save for the batch with zip data
        batchRepository.save(batch);

        return zipData;
    }

    private List<Map<String, String>> parseCSV(MultipartFile file) throws IOException {
        List<Map<String, String>> records = new ArrayList<>();
        try (Reader reader = new InputStreamReader(file.getInputStream());
                CSVParser csvParser = CSVFormat.DEFAULT.withFirstRecordAsHeader().parse(reader)) {

            for (CSVRecord csvRecord : csvParser) {
                Map<String, String> row = new HashMap<>();
                for (String header : csvParser.getHeaderNames()) {
                    row.put(header, csvRecord.get(header));
                }
                records.add(row);
            }
        }
        return records;
    }

    private byte[] zipPdfs(List<byte[]> pdfs, List<Map<String, String>> data) throws IOException {
        try (ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
                ZipOutputStream zos = new ZipOutputStream(byteArrayOutputStream)) {

            for (int i = 0; i < pdfs.size(); i++) {
                String fileName = data.get(i).getOrDefault("name", "participant_" + (i + 1)) + ".pdf";
                zos.putNextEntry(new ZipEntry(fileName));
                zos.write(pdfs.get(i));
                zos.closeEntry();
            }

            zos.finish();
            return byteArrayOutputStream.toByteArray();
        }
    }

    @Transactional
    public byte[] updateAndRegenerateCertificate(Long certId, Map<String, String> updatedData) throws Exception {
        ParticipantCertificate pc = certificateRepository.findById(certId)
                .orElseThrow(() -> new RuntimeException("Certificate not found"));

        Long templateId = pc.getTemplateId();
        if (templateId == null && pc.getBatch() != null) {
            templateId = pc.getBatch().getTemplateId();
        }

        if (templateId == null) {
            throw new RuntimeException("Could not find Template ID for this certificate. Please try generating a new batch.");
        }

        TemplateEntity template = getTemplateById(templateId);
        if (template == null) {
            throw new RuntimeException("Template not found for ID: " + pc.getTemplateId());
        }
        
        // Update PC metadata
        pc.setName(findValue(updatedData, "name", "full name", "participant"));
        pc.setEmail(findValue(updatedData, "email", "mail", "email id"));
        pc.setParticipantData(objectMapper.writeValueAsString(updatedData));
        
        // Regenerate PDF
        Map<String, String> mappedData = new HashMap<>(updatedData);
        mappedData.put("certificateId", pc.getCertificateId());

        String svgWithId = SvgUtils.insertCertificateId(template.getSvgContent(), pc.getCertificateId());
        String personalizedSvg = SvgUtils.replacePlaceholders(svgWithId, mappedData);
        byte[] pdf = SvgUtils.convertSvgToPdf(personalizedSvg);

        certificateRepository.save(pc);
        return pdf;
    }

    @Transactional
    public void deleteCertificate(Long id) {
        certificateRepository.deleteById(id);
    }

    private String findValue(Map<String, String> data, String... keys) {
        for (String key : keys) {
            for (String actualKey : data.keySet()) {
                if (actualKey.toLowerCase().contains(key.toLowerCase())) {
                    return data.get(actualKey);
                }
            }
        }
        return "N/A";
    }
}
