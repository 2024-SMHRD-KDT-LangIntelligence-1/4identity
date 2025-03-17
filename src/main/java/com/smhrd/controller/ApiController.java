package com.smhrd.controller;

import com.smhrd.service.MemberService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class ApiController {
    
    @Autowired
    private MemberService memberService;
    
    // 로그인 API
    @PostMapping("/login")
    public Map<String, Object> login(@RequestParam String userid, @RequestParam String passwd, HttpSession session) {
        Map<String, Object> result = memberService.login(userid, passwd);
        
        if ((Boolean) result.get("success")) {
            session.setAttribute("loginMember", result.get("member"));
        }
        
        return result;
    }
    
    // 로그아웃 API
    @PostMapping("/logout")
    public Map<String, Object> logout(HttpSession session) {
        Map<String, Object> result = new HashMap<>();
        
        session.removeAttribute("loginMember");
        session.invalidate();
        
        result.put("success", true);
        result.put("message", "로그아웃 되었습니다.");
        
        return result;
    }
    
    // 세션 메시지 클리어 API (에러 메시지와 성공 메시지를 삭제)
    @PostMapping("/clearSessionMessage")
    public Map<String, Object> clearSessionMessage(HttpSession session) {
        Map<String, Object> result = new HashMap<>();
        
        session.removeAttribute("errorMessage");
        session.removeAttribute("successMessage");
        
        result.put("success", true);
        
        return result;
    }
}
