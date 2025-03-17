package com.smhrd.service;

import com.smhrd.entity.Member;
import com.smhrd.repository.MemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class MemberService {
    
    @Autowired
    private MemberRepository memberRepository;
    
    // 회원가입
    public Map<String, Object> register(Member member) {
        Map<String, Object> result = new HashMap<>();
        
        // 아이디 중복 확인
        if (memberRepository.existsByUserid(member.getUserid())) {
            result.put("success", false);
            result.put("message", "이미 사용 중인 아이디입니다.");
            return result;
        }
        
        // 이메일 중복 확인
        if (memberRepository.existsByEmail(member.getEmail())) {
            result.put("success", false);
            result.put("message", "이미 사용 중인 이메일입니다.");
            return result;
        }
        
        // 회원 정보 저장
        memberRepository.save(member);
        result.put("success", true);
        result.put("message", "회원가입이 완료되었습니다.");
        
        return result;
    }
    
    // 로그인
    public Map<String, Object> login(String userid, String passwd) {
        Map<String, Object> result = new HashMap<>();
        
        Optional<Member> memberOptional = memberRepository.findByUserid(userid);
        
        if (memberOptional.isPresent()) {
            Member member = memberOptional.get();
            if (member.getPasswd().equals(passwd)) {
                result.put("success", true);
                result.put("member", member);
                result.put("clearError", true);  // 에러 메시지를 지우기 위한 플래그 추가
            } else {
                result.put("success", false);
                result.put("message", "비밀번호가 일치하지 않습니다.");
            }
        } else {
            result.put("success", false);
            result.put("message", "존재하지 않는 아이디입니다.");
        }
        
        return result;
    }
    
    // 회원 정보 수정
    public Map<String, Object> updateMember(Member member) {
        Map<String, Object> result = new HashMap<>();
        
        Optional<Member> memberOptional = memberRepository.findByUserid(member.getUserid());
        
        if (memberOptional.isPresent()) {
            Member existingMember = memberOptional.get();
            existingMember.setPasswd(member.getPasswd());
            existingMember.setEmail(member.getEmail());
            existingMember.setInterest(member.getInterest());
            
            memberRepository.save(existingMember);
            
            result.put("success", true);
            result.put("message", "회원 정보가 수정되었습니다.");
            result.put("member", existingMember);
        } else {
            result.put("success", false);
            result.put("message", "회원 정보를 찾을 수 없습니다.");
        }
        
        return result;
    }
    
    // 회원 정보 조회
    public Member getMemberByUserid(String userid) {
        Optional<Member> memberOptional = memberRepository.findByUserid(userid);
        return memberOptional.orElse(null);
    }
    
    // 세션에서 에러 메시지 제거
    public void clearErrorMessage() {
        // 세션 처리는 컨트롤러에서 이루어지므로 여기서는 별도 로직 없음
    }
}
