package com.GoalBased.demo.config;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.env.EnvironmentPostProcessor;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MapPropertySource;

import java.util.HashMap;
import java.util.Map;

/**
 * Neon/Render often provide postgres:// URLs; Spring JDBC needs jdbc:postgresql://
 */
public class PostgresUrlEnvironmentPostProcessor implements EnvironmentPostProcessor {

    @Override
    public void postProcessEnvironment(ConfigurableEnvironment environment, SpringApplication application) {
        String raw = environment.getProperty("SPRING_DATASOURCE_URL");
        if (raw == null || raw.isBlank()) {
            raw = environment.getProperty("DATABASE_URL");
        }
        if (raw == null || !raw.startsWith("postgres://")) {
            return;
        }

        Map<String, Object> map = new HashMap<>();
        map.put("spring.datasource.url", toJdbcUrl(raw));
        environment.getPropertySources().addFirst(new MapPropertySource("convertedPostgresUrl", map));
    }

    static String toJdbcUrl(String url) {
        String jdbc = url.replaceFirst("^postgres://", "jdbc:postgresql://");
        if (!jdbc.contains("sslmode=")) {
            jdbc += jdbc.contains("?") ? "&sslmode=require" : "?sslmode=require";
        }
        return jdbc;
    }
}
