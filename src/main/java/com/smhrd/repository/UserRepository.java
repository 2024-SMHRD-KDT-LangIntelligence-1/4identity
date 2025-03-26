package com.smhrd.repository;

import com.smhrd.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    // 아이디 존재 여부 확인
    boolean existsByUserId(String userId);
    
    // 이메일 존재 여부 확인
    boolean existsByUserEmail(String userEmail);
}
