package com.smhrd.controller;

import com.smhrd.domain.User;
import com.smhrd.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

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
            
            // "정책 및 법률"을 "정책 & 법률"로 변환
            if (userInterest != null && userInterest.equals("정책 및 법률")) {
                userInterest = "정책 & 법률";
            }
            
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
    
    /**
     * 로그인 API
     * @param loginRequest 로그인 요청 데이터 (userId, userPw)
     * @return 로그인 결과
     */
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> loginRequest) {
        System.out.println("로그인 요청 도착: " + loginRequest.get("userId"));
        
        try {
            // 요청 데이터 검증
            String userId = loginRequest.get("userId");
            String userPw = loginRequest.get("userPw");
            
            if (userId == null || userPw == null) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message", "아이디와 비밀번호를 모두 입력해주세요.");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            // 로그인 처리
            Map<String, Object> loginResult = userService.login(userId, userPw);
            
            Map<String, Object> response = new HashMap<>();
            int status = (int) loginResult.get("status");
            
            if (status == 2) { // 로그인 성공
                // Map에서 사용자 정보 가져오기 - 타입 캐스팅 수정
                @SuppressWarnings("unchecked")
                Map<String, Object> userMap = (Map<String, Object>) loginResult.get("user");
                
                response.put("success", true);
                response.put("message", "로그인 성공");
                response.put("userId", userMap.get("userId"));
                response.put("userEmail", userMap.get("userEmail"));
                response.put("userInterest", userMap.get("userInterest"));
                response.put("isLoggedIn", true);
            } else { // 로그인 실패
                response.put("success", false);
                response.put("message", loginResult.get("message"));
                response.put("status", status);
            }
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "서버 오류가 발생했습니다: " + e.getMessage());
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }
    
    /**
     * 사용자 프로필 조회 API
     * @param userId 조회할 사용자 아이디
     * @return 사용자 정보
     */
    @GetMapping("/profile/{userId}")
    public ResponseEntity<Map<String, Object>> getUserProfile(@PathVariable String userId) {
        System.out.println("프로필 조회 요청 도착: " + userId);
        
        try {
            Optional<User> userOpt = userService.getUserById(userId);
            
            if (userOpt.isEmpty()) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message", "사용자를 찾을 수 없습니다.");
                return ResponseEntity.status(404).body(errorResponse);
            }
            
            User user = userOpt.get();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("userId", user.getUserId());
            response.put("userEmail", user.getUserEmail());
            response.put("userInterest", user.getUserInterest());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "서버 오류가 발생했습니다: " + e.getMessage());
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }
    
    /**
     * 사용자 프로필 업데이트 API
     * @param userId 업데이트할 사용자 아이디
     * @param updateRequest 업데이트 요청 데이터
     * @return 업데이트 결과
     */
    @PutMapping("/profile/{userId}")
    public ResponseEntity<Map<String, Object>> updateUserProfile(
            @PathVariable String userId,
            @RequestBody Map<String, String> updateRequest) {
        System.out.println("프로필 업데이트 요청 도착: " + userId);
        
        try {
            String currentPassword = updateRequest.get("currentPassword");
            String newPassword = updateRequest.get("newPassword");
            String userEmail = updateRequest.get("userEmail");
            String userInterest = updateRequest.get("userInterest");
            
            // "정책 및 법률"을 "정책 & 법률"로 변환
            if (userInterest != null && userInterest.equals("정책 및 법률")) {
                userInterest = "정책 & 법률";
            }
            
            // 사용자 존재 확인
            Optional<User> userOpt = userService.getUserById(userId);
            if (userOpt.isEmpty()) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message", "사용자를 찾을 수 없습니다.");
                return ResponseEntity.status(404).body(errorResponse);
            }
            
            User user = userOpt.get();
            
            // 현재 비밀번호 확인 - 불일치 시 필드 정보 포함해서 반환
            if (!user.getUserPw().equals(currentPassword)) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message", "현재 비밀번호가 일치하지 않습니다.");
                errorResponse.put("field", "currentPassword");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            // 새 비밀번호가 있으면 업데이트
            if (newPassword != null && !newPassword.isEmpty()) {
                user.setUserPw(newPassword);
            }
            
            // 이메일 업데이트
            if (userEmail != null && !userEmail.isEmpty()) {
                user.setUserEmail(userEmail);
            }
            
            // 관심사 업데이트
            if (userInterest != null) {
                user.setUserInterest(userInterest);
            }
            
            // 사용자 정보 저장
            userService.updateUser(user);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "프로필이 성공적으로 업데이트되었습니다.");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "서버 오류가 발생했습니다: " + e.getMessage());
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }
    
    /**
     * 회원 탈퇴 API
     * @param userId 탈퇴할 사용자 아이디
     * @return 탈퇴 결과
     */
    @DeleteMapping("/{userId}")
    public ResponseEntity<Map<String, Object>> deleteUser(@PathVariable String userId) {
        System.out.println("회원 탈퇴 요청 도착: " + userId);
        
        try {
            // 비밀번호 검증 없이 삭제 처리
            boolean deleted = userService.deleteUserWithoutPasswordCheck(userId);
            
            Map<String, Object> response = new HashMap<>();
            if (deleted) {
                response.put("success", true);
                response.put("message", "회원 탈퇴가 완료되었습니다.");
            } else {
                response.put("success", false);
                response.put("message", "계정을 찾을 수 없습니다.");
            }
            
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
