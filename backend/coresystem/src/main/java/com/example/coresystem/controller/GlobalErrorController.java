package com.example.coresystem.controller;

import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class GlobalErrorController implements ErrorController {

    @RequestMapping("/error")
    public String handleError() {
        // すべての未定義パスをReactログイン画面にリダイレクト
        return "redirect:http://localhost:5173/login";
    }
}
