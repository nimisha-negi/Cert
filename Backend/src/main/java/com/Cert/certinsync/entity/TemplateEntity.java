package com.Cert.certinsync.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TemplateEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String templateName;

    @Lob
    private String svgContent;

    private LocalDateTime uploadTime;

	public String getTemplateName() {
		return templateName;
	}
	  public void setTemplateName(String templateName) {
	        this.templateName = templateName;
	    }
}
