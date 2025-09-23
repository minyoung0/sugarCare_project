package com.example.demo.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;

@Entity
@Getter
public class CharacterProfile {
    @Override
    public String toString() {
        return "CharacterProfile{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", age=" + age +
                ", kindergarten='" + kindergarten + '\'' +
                ", favorite='" + favorite + '\'' +
                '}';
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private int age;
    private String kindergarten;
    private String favorite;
}
