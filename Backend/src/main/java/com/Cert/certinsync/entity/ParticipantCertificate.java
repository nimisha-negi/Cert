package com.Cert.certinsync.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ParticipantCertificate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String email;
    private String templateName;
    private Long templateId;

    @Column(unique = true, nullable = false)
    private String certificateId;

    private LocalDateTime issuedDate;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String participantData;

    @ManyToOne
    @JoinColumn(name = "batch_id")
    private GenerationBatch batch;
}
