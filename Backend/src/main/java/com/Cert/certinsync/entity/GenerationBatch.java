package com.Cert.certinsync.entity;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GenerationBatch {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String templateName;
    private LocalDateTime timestamp;
    private LocalDateTime expiryDate;
    private Integer participantCount;
    private Long templateId;

    @Lob
    @Column(columnDefinition = "LONGBLOB")
    private byte[] zipData;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany(mappedBy = "batch", cascade = CascadeType.ALL)
    @JsonIgnore
    private java.util.List<ParticipantCertificate> certificates;
}
