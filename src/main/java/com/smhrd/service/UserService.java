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
            log.debug("로그인 시도: {}", userId);
            
            // 사용자 아이디로 사용자 정보 조회
            Optional<User> userOptional = userRepository.findById(userId);
            
            // 아이디가 존재하지 않는 경우
            if (userOptional.isEmpty()) {
                log.debug("사용자 아이디 없음: {}", userId);
                result.put("status", 0);
                result.put("message", "가입 정보가 없습니다");
                return result;
            }
            
            User user = userOptional.get();
            
            // 비밀번호 확인
            if (!user.getUserPw().equals(userPw)) {
                log.debug("비밀번호 불일치: {}", userId);
                result.put("status", 1);
                result.put("message", "비밀번호가 틀렸습니다");
                return result;
            }
            
            // 로그인 성공
            log.debug("로그인 성공: {}", userId);
            result.put("status", 2);
            result.put("message", "로그인 성공");
            result.put("user", user);
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
}
