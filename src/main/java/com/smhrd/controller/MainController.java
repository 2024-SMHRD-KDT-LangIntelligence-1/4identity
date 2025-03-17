package com.smhrd.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class MainController {
    
    @GetMapping("/")
    public String index(Model model) {
        model.addAttribute("message", "Hello");
        model.addAttribute("imageUrl", "https://www.bigkinds.or.kr/resources/images/02100801/2025/03/13/02100801.20250313084528001.01.jpg");
        return "index";
    }
}
