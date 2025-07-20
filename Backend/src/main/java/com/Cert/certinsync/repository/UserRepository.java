package com.Cert.certinsync.repository;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.Cert.certinsync.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email); // THIS must return Optional<User>
}

