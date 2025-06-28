package com.example.coresystem.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class RootApiController {
    @GetMapping("/")
    public String redirectToLogin() {
        // React開発サーバーのログイン画面へリダイレクト
        return "redirect:http://localhost:5173/login";
        // または "redirect:http://localhost:5173/login" でもOK
    }
}
