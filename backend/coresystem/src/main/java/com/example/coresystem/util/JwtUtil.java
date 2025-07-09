package com.example.coresystem.util;

import java.util.Date;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

public class JwtUtil {
    private static final String SECRET = "your-very-secret-key-should-be-long-enough";
    private static final long EXPIRATION_TIME = 1000 * 60 * 60; // 1時間

    public static String generateToken(String username, String role) {
        return Jwts.builder()
                .claim("username", username)
                .claim("role", role)
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(SignatureAlgorithm.HS256, SECRET)
                .compact();
    }

    public static Claims validateTokenAndGetClaims(String token) {
        return Jwts.parser()
                .setSigningKey(SECRET)
                .parseClaimsJws(token)
                .getBody();
    }

    public static String getUsername(String token) {
        return validateTokenAndGetClaims(token).get("username", String.class);
    }

    public static String getRole(String token) {
        return validateTokenAndGetClaims(token).get("role", String.class);
    }
}
