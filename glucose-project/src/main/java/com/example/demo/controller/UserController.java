package com.example.demo.controller;

import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;


@RestController
@RequestMapping("/user")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping("/join")
    public void join(@RequestBody User user){
        System.out.println("아이디: " + user.getUserId());
        System.out.println("비밀번호: " + user.getPassword());
        System.out.println("이름: " + user.getUserName());
        System.out.println("혈당 관련 질병 유무: " + user.getUserType());
        System.out.println("보호자 : "+ user.getGuardianUserId());
        userRepository.save(user);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User req){
        System.out.println(req.getUserId());
        System.out.println(req.getPassword());
        return userRepository.findByUserId(req.getUserId())
                .map(user -> {
                    // 비밀번호 검증
                    if (user.getPassword().equals(req.getPassword())) {
                        Map<String, Object> profile = new HashMap<>();
                        return ResponseEntity.ok(profile);
                    } else {
                        System.out.println("비밀번호 오류");
                        return ResponseEntity.status(401).body("비밀번호가 올바르지 않습니다");
                    }
                })
                .orElseGet(() ->                        ResponseEntity.status(401).body("아이디가 존재하지 않습니다"));
    }
}
