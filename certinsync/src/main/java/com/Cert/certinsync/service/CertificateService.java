package com.Cert.certinsync.service;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.Cert.certinsync.entity.TemplateEntity;
import com.Cert.certinsync.repository.TemplateRepository;
import com.Cert.certinsync.utils.SvgUtils;

import java.io.*;
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

    public byte[] generateCertificates(Long templateId, MultipartFile csvFile) throws Exception {
        TemplateEntity template = templateRepository.findById(templateId)
                .orElseThrow(() -> new RuntimeException("Template not found"));

        List<Map<String, String>> participantData = parseCSV(csvFile);
        List<byte[]> pdfs = new ArrayList<>();

        for (Map<String, String> row : participantData) {
            String personalizedSvg = SvgUtils.replacePlaceholders(template.getSvgContent(), row);
            byte[] pdf = SvgUtils.convertSvgToPdf(personalizedSvg);
            pdfs.add(pdf);
        }

        return zipPdfs(pdfs, participantData);
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
}
