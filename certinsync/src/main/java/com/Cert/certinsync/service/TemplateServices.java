package com.Cert.certinsync.service;

import com.Cert.certinsync.entity.TemplateEntity;
import com.Cert.certinsync.repository.TemplateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class TemplateServices {

    @Autowired
    private TemplateRepository templateRepository;
    public TemplateEntity saveTemplate(MultipartFile file) throws IOException {
        String svgContent = new String(file.getBytes());
        TemplateEntity template = TemplateEntity.builder()
                .fileName(file.getOriginalFilename())
                .svgContent(svgContent)
                .uploadTime(LocalDateTime.now())
                .build();

        return templateRepository.save(template);
    }

    public TemplateEntity uploadTemplate(MultipartFile file) throws IOException {
        if (!file.getOriginalFilename().endsWith(".svg")) {
            throw new IllegalArgumentException("Only .svg files are supported.");
        }

        TemplateEntity template = TemplateEntity.builder()
                .fileName(file.getOriginalFilename())
                .svgContent(new String(file.getBytes()))
                .uploadTime(LocalDateTime.now())
                .build();

        return templateRepository.save(template);
    }

    public TemplateEntity getTemplateById(Long id) {
        return templateRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Template not found with ID: " + id));
    }

    public List<TemplateEntity> getAllTemplates() {
        return templateRepository.findAll();
    }

    public void deleteTemplate(Long id) {
        if (!templateRepository.existsById(id)) {
            throw new RuntimeException("Template not found with ID: " + id);
        }
        templateRepository.deleteById(id);
    }
}