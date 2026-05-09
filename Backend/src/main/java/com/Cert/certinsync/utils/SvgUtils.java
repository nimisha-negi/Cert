package com.Cert.certinsync.utils;

import org.apache.batik.transcoder.TranscoderInput;
import org.apache.batik.transcoder.TranscoderOutput;
import org.apache.fop.apps.*;
import org.apache.fop.svg.PDFTranscoder;

import java.io.*;
import java.util.Map;

public class SvgUtils {

    public static String replacePlaceholders(String svg, Map<String, String> data) {
        for (Map.Entry<String, String> entry : data.entrySet()) {
            svg = svg.replace("{" + entry.getKey() + "}", entry.getValue());
        }
        return svg;
    }

    public static String replacePlaceholdersWithMapping(String svg, Map<String, String> data, Map<String, String> mappings) {
        for (Map.Entry<String, String> mapping : mappings.entrySet()) {
            String placeholder = mapping.getKey();
            String csvColumn = mapping.getValue();
            String value = data.get(csvColumn);
            if (value != null) {
                svg = svg.replace("{" + placeholder + "}", value);
            }
        }
        return svg;
    }
    
    public static String insertCertificateId(String svgContent, String certId) {
        String idText = """
            <text x="50%" y="95%" text-anchor="middle"
                  font-size="16" fill="black" font-family="Arial" font-weight="bold">
                Certificate ID: """ + certId + "</text>";

        // Insert the ID text right before the closing SVG tag
        return svgContent.replace("</svg>", idText + "\n</svg>");
    }

    public static java.util.Set<String> extractPlaceholders(String svg) {
        java.util.Set<String> placeholders = new java.util.HashSet<>();
        java.util.regex.Pattern pattern = java.util.regex.Pattern.compile("\\{([^}]+)\\}");
        java.util.regex.Matcher matcher = pattern.matcher(svg);
        while (matcher.find()) {
            placeholders.add(matcher.group(1));
        }
        return placeholders;
    }




    public static byte[] convertSvgToPdf(String svg) throws Exception {
        try (ByteArrayOutputStream pdfOut = new ByteArrayOutputStream()) {
            TranscoderInput input = new TranscoderInput(new StringReader(svg));
            TranscoderOutput output = new TranscoderOutput(pdfOut);
            PDFTranscoder transcoder = new PDFTranscoder();
            transcoder.transcode(input, output);
            return pdfOut.toByteArray();
        }
    }
}
