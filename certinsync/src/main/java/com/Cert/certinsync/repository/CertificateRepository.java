package com.Cert.certinsync.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.Cert.certinsync.entity.ParticipantCertificate;

@Repository
	public interface CertificateRepository extends JpaRepository<ParticipantCertificate, Long> {
	}


