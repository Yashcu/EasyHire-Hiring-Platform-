package com.easyhire.config;

import com.easyhire.security.JwtAuthenticationFilter;
import com.easyhire.security.RateLimitingFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtFilter;
    private final RateLimitingFilter rateLimitingFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtFilter, RateLimitingFilter rateLimitingFilter) {
        this.jwtFilter = jwtFilter;
        this.rateLimitingFilter = rateLimitingFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/v1/auth/**", "/swagger-ui/**", "/v3/api-docs/**").permitAll()
                        .requestMatchers("/health").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/v1/internships/**").permitAll()

                        .requestMatchers(HttpMethod.POST, "/api/v1/internships/*/apply")
                        .hasRole("CANDIDATE")

                        .requestMatchers(HttpMethod.GET, "/api/v1/applications/me")
                        .hasRole("CANDIDATE")

                        // Recruiter endpoints
                        .requestMatchers(HttpMethod.POST, "/api/v1/internships")
                        .hasRole("RECRUITER")

                        .requestMatchers(HttpMethod.PUT, "/api/v1/internships/**")
                        .hasRole("RECRUITER")

                        .requestMatchers(HttpMethod.GET, "/api/v1/internships/*/applications")
                        .hasRole("RECRUITER")

                        .requestMatchers(HttpMethod.PATCH, "/api/v1/applications/*/status")
                        .hasRole("RECRUITER")


                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
                .addFilterBefore(rateLimitingFilter, JwtAuthenticationFilter.class);

        return http.build();
    }
}