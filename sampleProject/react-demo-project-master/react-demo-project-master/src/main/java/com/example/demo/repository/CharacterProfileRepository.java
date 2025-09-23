package com.example.demo.repository;

import com.example.demo.entity.CharacterProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CharacterProfileRepository extends JpaRepository<CharacterProfile,Long> {
    Optional<CharacterProfile> findByName(String name);
}
