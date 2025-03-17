package com.smhrd.repository;

import com.smhrd.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MemberRepository extends JpaRepository<Member, Long> {
    Optional<Member> findByUserid(String userid); 
    boolean existsByUserid(String userid); 
    boolean existsByEmail(String email);
}
