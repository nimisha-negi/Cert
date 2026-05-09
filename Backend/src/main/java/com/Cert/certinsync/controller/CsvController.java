package com.Cert.certinsync.controller;

import com.Cert.certinsync.dto.MappingRequest;
import com.Cert.certinsync.dto.MappingResponse;
import com.Cert.certinsync.service.CsvServices;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/csv")
@RequiredArgsConstructor
public class CsvController {

    private final CsvServices csvServices;

    @PostMapping("/upload")
    public ResponseEntity<Map<String, Object>> uploadCsv(@RequestParam("file") MultipartFile file) throws IOException {
        Map<String, Object> result = csvServices.parseCsv(file);
        return ResponseEntity.ok(result);
    }
 
    @PostMapping("/map-fields")
    public ResponseEntity<MappingResponse> saveFieldMapping(@RequestBody MappingRequest request) {
        MappingResponse response = csvServices.saveMapping(request);
        return ResponseEntity.ok(response);
    }
}
