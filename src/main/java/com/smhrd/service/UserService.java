package com.smhrd.service;

import com.smhrd.domain.User;
import com.smhrd.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

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
}
