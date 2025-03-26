package com.smhrd.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "`TB_USER`")
public class User {
    
    @Id
    @Column(name = "USER_ID")
    private String userId;
    
    @Column(name = "USER_PW", nullable = false)
    private String userPw;
    
    @Column(name = "USER_EMAIL", nullable = false)
    private String userEmail;
    
    @Column(name = "USER_INTEREST")
    private String userInterest;
    
    @Column(name = "JOINED_AT", columnDefinition = "TIMESTAMP")
    private LocalDateTime joinedAt;
}
