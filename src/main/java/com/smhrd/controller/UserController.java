package com.smhrd.controller;

import com.smhrd.domain.User;
import com.smhrd.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    
    private final UserService userService;
    
    /**
     * 아이디 중복 확인 API
     * @param userId 확인할 사용자 아이디
     * @return 중복 여부
     */
    @GetMapping("/check-id")
    public ResponseEntity<Map<String, Object>> checkUserId(@RequestParam String userId) {
        System.out.println("아이디 중복 확인 요청 도착: " + userId);
        
        try {
            boolean isDuplicate = userService.checkUserIdDuplicate(userId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("isDuplicate", isDuplicate);
            response.put("message", isDuplicate ? "이미 존재하는 아이디입니다." : "사용 가능한 아이디입니다.");
            
            System.out.println("응답 전송: " + response);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", true);
            errorResponse.put("message", "서버 오류가 발생했습니다: " + e.getMessage());
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }
    
    /**
     * 회원가입 API
     * @param registerRequest 회원가입 요청 데이터
     * @return 회원가입 결과
     */
    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody Map<String, String> registerRequest) {
        System.out.println("회원가입 요청 도착: " + registerRequest);
        
        try {
            // 요청 데이터 검증
            String userId = registerRequest.get("userId");
            String userPw = registerRequest.get("userPw");
            String userEmail = registerRequest.get("userEmail");
            String userInterest = registerRequest.get("userInterest");
            
            if (userId == null || userPw == null || userEmail == null) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message", "필수 정보가 누락되었습니다.");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            // 아이디 중복 확인
            if (userService.checkUserIdDuplicate(userId)) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message", "이미 존재하는 아이디입니다.");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            // 사용자 객체 생성
            User user = User.builder()
                    .userId(userId)
                    .userPw(userPw)
                    .userEmail(userEmail)
                    .userInterest(userInterest)
                    .build();
            
            // 사용자 등록
            User registeredUser = userService.register(user);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "회원가입이 완료되었습니다.");
            response.put("userId", registeredUser.getUserId());
            
            System.out.println("회원가입 성공: " + registeredUser.getUserId());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "서버 오류가 발생했습니다: " + e.getMessage());
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }
}
