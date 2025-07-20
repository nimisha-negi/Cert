package com.Cert.certinsync.service;

import com.Cert.certinsync.dto.MappingRequest;
import com.Cert.certinsync.dto.MappingResponse;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
@Slf4j
public class CsvServices {

    private final Map<String, String> mappingStore = new ConcurrentHashMap<>();

    public List<String> extractHeaders(MultipartFile file) throws IOException {
        try (Reader reader = new InputStreamReader(file.getInputStream());
             CSVParser csvParser = CSVFormat.DEFAULT.withFirstRecordAsHeader().parse(reader)) {
            return new ArrayList<>(csvParser.getHeaderMap().keySet());
        } catch (Exception e) {
            log.error("Failed to parse CSV: {}", e.getMessage());
            throw new IOException("Invalid CSV file", e);
        }
    }

    public MappingResponse saveMapping(MappingRequest request) {
        mappingStore.clear(); // or handle multiple users with a sessionId key
        mappingStore.putAll(request.getFieldMapping());
        return new MappingResponse(mappingStore);
    }

    // Optional: getter if needed later
    public Map<String, String> getCurrentMapping() {
        return new HashMap<>(mappingStore);
    }
}
