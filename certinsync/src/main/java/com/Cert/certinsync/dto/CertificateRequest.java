package com.Cert.certinsync.dto;

import lombok.Data;
import java.util.List;
import java.util.Map;

@Data
public class CertificateRequest {
    private List<Map<String, String>> participants; // CSV row-wise data
    private byte[] templateBytes; // File content of uploaded certificate
    private Map<String, String> fieldMapping; // placeholder → csvHeader
}

