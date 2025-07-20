package com.Cert.certinsync.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.Cert.certinsync.entity.ParticipantCertificate;

@Repository
	public interface CertificateRepository extends JpaRepository<ParticipantCertificate, Long> {
	Optional<ParticipantCertificate> findByCertificateId(String certificateId);

	}


