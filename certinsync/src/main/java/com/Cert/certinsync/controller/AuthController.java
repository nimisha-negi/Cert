package com.Cert.certinsync.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.Cert.certinsync.entity.User;
import com.Cert.certinsync.repository.UserRepository;
import com.Cert.certinsync.utils.JwtUtils;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;
    private final JwtUtils jwt;

    @Value("${google.client-id}")
    private String googleClientId;

    @PostMapping("/google")
    public ResponseEntity<?> login(@RequestBody Map<String, String> p) {
        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), JacksonFactory.getDefaultInstance())
                    .setAudience(List.of(googleClientId))
                    .build();

            GoogleIdToken idToken = verifier.verify(p.get("credential"));
            if (idToken == null) return ResponseEntity.status(401).body("Invalid ID Token");

            GoogleIdToken.Payload payload = idToken.getPayload();
            String email = payload.getEmail();
            String name = (String) payload.get("name");
            String pic = (String) payload.get("picture");

            User user = userRepository.findByEmail(email)
            	    .orElseGet(() -> userRepository.save(User.builder()
            	        .email(email)
            	        .name(name)
            	        .picture(pic)
            	        .build()));


            String token = jwt.generateToken(email);

            return ResponseEntity.ok(Map.of(
                    "token", token,
                    "email", user.getEmail(),
                    "name", user.getName(),
                    "picture", user.getPicture()
            ));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Google verification failed");
        }
    }
}
