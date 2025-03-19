package com.smhrd.controller;

import com.smhrd.entity.Member;
import com.smhrd.service.MemberService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.HashMap;

@Controller
public class MemberController {

    @Autowired
    private MemberService memberService;

    
    // 회원가입 페이지
    @GetMapping("/signup")
    public String signupForm() {
        return "signup";
    }

    
    // 회원가입 처리
    @PostMapping("/signup")
    public String signup(Member member, HttpSession session) {
        Map<String, Object> result = memberService.register(member);

        if ((Boolean) result.get("success")) {
            // 회원가입 성공 후 로그인 상태로 홈 페이지로 이동
            session.setAttribute("loginMember", member);
            return "redirect:/"; // 메인 페이지로 리다이렉트
        } else {
            // 실패 시 에러 메시지와 함께 회원가입 페이지로 리다이렉트
            session.setAttribute("errorMessage", result.get("message"));
            return "redirect:/signup";
        }
    }

    // 내 정보 페이지
    @GetMapping("/profile")
    public String profileForm(HttpSession session, Model model) {
        Member loginMember = (Member) session.getAttribute("loginMember");

        if (loginMember == null) {
            return "redirect:/login"; // 로그인 페이지로 리다이렉트
        }

        model.addAttribute("member", loginMember);
        return "profile";
    }

    // 회원 정보 수정
    @PostMapping("/profile")
    public String updateProfile(Member member, HttpSession session) {
        Member loginMember = (Member) session.getAttribute("loginMember");

        if (loginMember == null) {
            return "redirect:/login"; // 로그인 페이지로 리다이렉트
        }

        member.setUserid(loginMember.getUserid());
        Map<String, Object> result = memberService.updateMember(member);

        if ((Boolean) result.get("success")) {
            // 정보 수정 성공 시 세션 업데이트
            session.setAttribute("loginMember", result.get("member"));
            // 성공 메시지 추가
            session.setAttribute("successMessage", "회원 정보가 성공적으로 업데이트되었습니다.");
        } else {
            // 실패 메시지 추가
            session.setAttribute("errorMessage", result.get("message"));
        }

        return "redirect:/profile";
    }

    // 로그인 페이지
    @GetMapping("/login")
    public String loginForm() {
        return "login"; // login.html을 반환
    }

    // 로그인 처리
    @PostMapping("/login")
    public String login(@RequestParam String userid, @RequestParam String passwd, HttpSession session) {
        Map<String, Object> result = memberService.login(userid, passwd);

        if ((Boolean) result.get("success")) {
            session.setAttribute("loginMember", result.get("member"));
            return "redirect:/"; // 메인 페이지로 리다이렉트
        } else {
            session.setAttribute("errorMessage", result.get("message"));
            return "redirect:/login";
        }
    }

    // 로그아웃 처리
    @PostMapping("/logout")
    public String logout(HttpSession session) {
        session.removeAttribute("loginMember");
        session.invalidate();
        return "redirect:/";
    }

    // 세션에서 에러 메시지를 지우는 API
    @PostMapping("/clearSessionMessage")
    @ResponseBody
    public Map<String, Object> clearSessionMessage(HttpSession session) {
        Map<String, Object> response = new HashMap<>();
        
        if (session.getAttribute("errorMessage") != null) {
            session.removeAttribute("errorMessage");
            response.put("success", true);
            response.put("message", "Session message cleared");
        } else {
            response.put("success", false);
            response.put("message", "No message to clear");
        }
        
        return response;
    }
}
