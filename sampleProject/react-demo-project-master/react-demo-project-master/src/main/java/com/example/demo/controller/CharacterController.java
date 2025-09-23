package com.example.demo.controller;

import com.example.demo.entity.CharacterProfile;
import com.example.demo.repository.CharacterProfileRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/characters")
@CrossOrigin(origins = "http://localhost:3000")
public class CharacterController {

    private final CharacterProfileRepository repo;

    public CharacterController(CharacterProfileRepository repo) {
        this.repo = repo;
    }

    @GetMapping("/{name}")
    public ResponseEntity<CharacterProfile> getByName(@PathVariable String name) {
        System.out.println("요청받은 이름: " + name);

        return repo.findByName(name)
                .map(profile -> {
                    System.out.println("조회 결과: " + profile);
                    return ResponseEntity.ok(profile);
                })
                .orElseGet(() -> {
                    System.out.println("조회 실패: 해당 이름 없음");
                    return ResponseEntity.notFound().build();
                });
    }

}