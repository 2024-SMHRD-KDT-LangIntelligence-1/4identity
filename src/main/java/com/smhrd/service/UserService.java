package com.smhrd.service;

import com.smhrd.domain.User;
import com.smhrd.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {
    
    private final UserRepository userRepository;
    
    /**
     * 아이디 중복 확인
     * @param userId 사용자 아이디
     * @return 중복 여부 (true: 중복, false: 사용 가능)
     */
    @Transactional(readOnly = true)
    public boolean checkUserIdDuplicate(String userId) {
        try {
            log.debug("아이디 중복 확인 시도: {}", userId);
            boolean exists = userRepository.existsByUserId(userId);
            log.debug("아이디 존재 여부: {}", exists);
            return exists;
        } catch (Exception e) {
            log.error("아이디 중복 확인 중 오류 발생: {}", e.getMessage(), e);
            throw new RuntimeException("아이디 중복 확인 중 오류가 발생했습니다.", e);
        }
    }
    
    /**
     * 회원 가입
     * @param user 사용자 정보
     * @return 저장된 사용자 정보
     */
    @Transactional
    public User register(User user) {
        try {
            // 회원가입 시간 설정
            user.setJoinedAt(LocalDateTime.now());
            log.debug("회원가입 시도: {}", user.getUserId());
            User savedUser = userRepository.save(user);
            log.debug("회원가입 성공: {}", savedUser.getUserId());
            return savedUser;
        } catch (Exception e) {
            log.error("회원가입 중 오류 발생: {}", e.getMessage(), e);
            throw new RuntimeException("회원가입 중 오류가 발생했습니다.", e);
        }
    }
    
    /**
     * 로그인 검증
     * @param userId 사용자 아이디
     * @param userPw 사용자 비밀번호
     * @return 로그인 결과 (0: 아이디 없음, 1: 비밀번호 불일치, 2: 로그인 성공, user 객체 포함)
     */
    @Transactional(readOnly = true)
    public Map<String, Object> login(String userId, String userPw) {
        Map<String, Object> result = new HashMap<>();
        
        try {
            log.info("로그인 시도: {}", userId);
            
            // 사용자 아이디로 사용자 정보 조회
            Optional<User> userOptional = userRepository.findById(userId);
            
            // 아이디가 존재하지 않는 경우
            if (userOptional.isEmpty()) {
                log.warn("사용자 아이디 없음: {}", userId);
                result.put("status", 0);
                result.put("message", "가입 정보가 없습니다");
                return result;
            }
            
            User user = userOptional.get();
            
            // 비밀번호 확인
            if (!user.getUserPw().equals(userPw)) {
                log.warn("비밀번호 불일치: {}", userId);
                result.put("status", 1);
                result.put("message", "비밀번호가 틀렸습니다");
                return result;
            }
            
            // 로그인 성공 - 상세 정보 로그 추가
            log.info("로그인 성공: {}", userId);
            log.info("사용자 정보 - ID: {}, 이메일: {}, 관심사: {}, 가입일: {}", 
                     user.getUserId(), 
                     user.getUserEmail(), 
                     user.getUserInterest(), 
                     user.getJoinedAt());
            
            // 클라이언트에 전달할 사용자 정보 객체 생성 - 비밀번호 제외
            Map<String, Object> userMap = new HashMap<>();
            userMap.put("userId", user.getUserId());
            userMap.put("userEmail", user.getUserEmail());
            userMap.put("userInterest", user.getUserInterest());
            userMap.put("joinedAt", user.getJoinedAt());
            userMap.put("isLoggedIn", true);  // 로그인 상태 명시적으로 추가
            
            result.put("status", 2);
            result.put("message", "로그인 성공");
            result.put("user", userMap);  // User 엔티티 대신 Map 사용
            
            return result;
            
        } catch (Exception e) {
            log.error("로그인 중 오류 발생: {}", e.getMessage(), e);
            result.put("status", -1);
            result.put("message", "로그인 처리 중 오류가 발생했습니다");
            return result;
        }
    }
    
    /**
     * 사용자 ID로 사용자 정보 조회
     * @param userId 사용자 ID
     * @return 사용자 정보
     */
    @Transactional(readOnly = true)
    public Optional<User> getUserById(String userId) {
        try {
            log.debug("사용자 정보 조회: {}", userId);
            return userRepository.findById(userId);
        } catch (Exception e) {
            log.error("사용자 정보 조회 중 오류 발생: {}", e.getMessage(), e);
            throw new RuntimeException("사용자 정보 조회 중 오류가 발생했습니다.", e);
        }
    }
    
    /**
     * 사용자 정보 업데이트
     * @param user 업데이트할 사용자 정보
     * @return 업데이트된 사용자 정보
     */
    @Transactional
    public User updateUser(User user) {
        try {
            log.debug("사용자 정보 업데이트: {}", user.getUserId());
            return userRepository.save(user);
        } catch (Exception e) {
            log.error("사용자 정보 업데이트 중 오류 발생: {}", e.getMessage(), e);
            throw new RuntimeException("사용자 정보 업데이트 중 오류가 발생했습니다.", e);
        }
    }
    
    /**
     * 회원 탈퇴
     * @param userId 사용자 ID
     * @param userPw 사용자 비밀번호 (확인용)
     * @return 탈퇴 결과 (true: 성공, false: 실패)
     */
    @Transactional
    public boolean deleteUser(String userId, String userPw) {
        try {
            log.debug("회원 탈퇴 시도: {}", userId);
            
            // 사용자 존재 확인 및 비밀번호 검증
            Optional<User> userOptional = userRepository.findById(userId);
            if (userOptional.isEmpty()) {
                log.debug("회원 탈퇴 실패: 사용자가 존재하지 않음 - {}", userId);
                return false;
            }
            
            User user = userOptional.get();
            
            // 비밀번호 확인
            if (!user.getUserPw().equals(userPw)) {
                log.debug("회원 탈퇴 실패: 비밀번호 불일치 - {}", userId);
                return false;
            }
            
            // 사용자 삭제
            userRepository.delete(user);
            log.debug("회원 탈퇴 성공: {}", userId);
            return true;
        } catch (Exception e) {
            log.error("회원 탈퇴 중 오류 발생: {}", e.getMessage(), e);
            throw new RuntimeException("회원 탈퇴 중 오류가 발생했습니다.", e);
        }
    }

    /**
     * 비밀번호 확인 없이 회원 탈퇴
     * @param userId 사용자 ID
     * @return 탈퇴 결과 (true: 성공, false: 실패)
     */
    @Transactional
    public boolean deleteUserWithoutPasswordCheck(String userId) {
        try {
            log.debug("회원 탈퇴 시도 (비밀번호 확인 없음): {}", userId);
            
            // 사용자 존재 확인
            Optional<User> userOptional = userRepository.findById(userId);
            if (userOptional.isEmpty()) {
                log.debug("회원 탈퇴 실패: 사용자가 존재하지 않음 - {}", userId);
                return false;
            }
            
            User user = userOptional.get();
            
            // 사용자 삭제
            userRepository.delete(user);
            log.debug("회원 탈퇴 성공: {}", userId);
            return true;
        } catch (Exception e) {
            log.error("회원 탈퇴 중 오류 발생: {}", e.getMessage(), e);
            throw new RuntimeException("회원 탈퇴 중 오류가 발생했습니다.", e);
        }
    }
}
