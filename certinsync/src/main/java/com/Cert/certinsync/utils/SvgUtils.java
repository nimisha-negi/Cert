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
