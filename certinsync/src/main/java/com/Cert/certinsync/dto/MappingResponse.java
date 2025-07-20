package com.Cert.certinsync.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.Map;

@Data
@AllArgsConstructor
public class MappingResponse {
    private Map<String, String> fieldMapping;
}
