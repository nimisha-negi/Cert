package com.Cert.certinsync.controller;

import com.Cert.certinsync.entity.TemplateEntity;
import com.Cert.certinsync.repository.TemplateRepository;
import com.Cert.certinsync.service.TemplateServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/templates")
@CrossOrigin
public class TemplateController {

    @Autowired
    private TemplateServices templateServices;

    @PostMapping("/upload")
    public ResponseEntity<Map<String, Object>> uploadTemplate(@RequestParam("file") MultipartFile file) {
        try {
            TemplateEntity saved = templateServices.saveTemplate(file);
            return ResponseEntity.ok(Map.of(
                    "templateId", saved.getId(),
                    "message", "Template uploaded successfully"
            ));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of("error", "Upload failed: " + e.getMessage()));
        }
    }




    @GetMapping("/{id}")
    public ResponseEntity<?> getTemplateById(@PathVariable Long id) {
        try {
            TemplateEntity template = templateServices.getTemplateById(id);
            return ResponseEntity.ok(template);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(404).body(error);
        }
    }

    @GetMapping
    public ResponseEntity<List<TemplateEntity>> getAllTemplates() {
        return ResponseEntity.ok(templateServices.getAllTemplates());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTemplate(@PathVariable Long id) {
        try {
            templateServices.deleteTemplate(id);
            return ResponseEntity.ok(Map.of("message", "Template deleted successfully."));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        }
    }
}