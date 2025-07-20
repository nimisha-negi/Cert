package com.Cert.certinsync.config;


import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.google.api.client.util.Value;
@Configuration
@EnableWebSecurity
public class SecurityConfig {

  @Value("${cors.allowed.origin}")
  private String frontendOrigin;

  @Bean
  public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http.csrf(csrf -> csrf.disable())
      .cors(cors -> cors.configurationSource(corsConfig()))
      .authorizeHttpRequests(auth -> 
      auth.requestMatchers("/auth/**", "/api/templates/upload", "/api/csv/upload","api/certificates/generate").permitAll()
          .anyRequest().authenticated())

      .oauth2Login(oauth2 -> oauth2.disable());
    return http.build();
  }

  @Bean
  public CorsConfigurationSource corsConfig() {
      CorsConfiguration config = new CorsConfiguration();
      config.setAllowedOrigins(List.of("http://localhost:5173")); // ✅ make sure this is not null
      config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE"));
      config.setAllowedHeaders(List.of("*"));
      config.setAllowCredentials(true);

      UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
      source.registerCorsConfiguration("/**", config);
      return source;
  }

}
