package com.Cert.certinsync.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
    
    @Entity
    public class ParticipantCertificate {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        private String name;
        private String email;
        private String templateName;
        private LocalDateTime issuedDate;

        // getters/setters
    }


