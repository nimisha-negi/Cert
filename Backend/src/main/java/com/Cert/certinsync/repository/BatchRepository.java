package com.Cert.certinsync.repository;

import com.Cert.certinsync.entity.GenerationBatch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BatchRepository extends JpaRepository<GenerationBatch, Long> {
    
    @Query("SELECT b.id, b.templateName, b.timestamp, b.expiryDate, b.participantCount FROM GenerationBatch b ORDER BY b.timestamp DESC")
    List<Object[]> findAllMetadata();
    
    @Query("SELECT b.id, b.templateName, b.timestamp, b.expiryDate, b.participantCount FROM GenerationBatch b WHERE b.user.email = :email ORDER BY b.timestamp DESC")
    List<Object[]> findMetadataByUser(String email);

    void deleteByExpiryDateBefore(LocalDateTime dateTime);
}
