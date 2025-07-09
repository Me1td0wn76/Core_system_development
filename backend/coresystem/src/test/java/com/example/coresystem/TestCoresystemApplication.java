package com.example.coresystem;

// Import JwtUtil if it exists in your project
import com.example.coresystem.util.JwtUtil;

public class TestCoresystemApplication {

	public static void main(String[] args) {
		String token = JwtUtil.generateToken("root", "admin");
		System.out.println(token);
	}

}
