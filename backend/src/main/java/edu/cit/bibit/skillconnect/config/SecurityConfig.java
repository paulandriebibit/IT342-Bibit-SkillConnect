package edu.cit.bibit.skillconnect.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.Customizer;

@Configuration
public class SecurityConfig {

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(Customizer.withDefaults())
                .authorizeHttpRequests(auth -> auth
                        // 1. SPECIFIC PATHS FIRST
                        .requestMatchers("/api/v1/auth/**").permitAll()
                        .requestMatchers("/api/v1/skills/**").permitAll()
                        .requestMatchers("/api/v1/bookings/**").permitAll()

                        // 2. CATCH-ALL LAST
                        .anyRequest().authenticated()
                );

        return http.build();
    }
}