package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Board {
    @Override
    public String toString() {
        return "Board{" +
                "id=" + id +
                ", userId='" + userId + '\'' +
                ", title='" + title + '\'' +
                ", content='" + content + '\'' +
                ", deleteYn='" + deleteYn + '\'' +
                ", registDate='" + registDate + '\'' +
                '}';
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userId;
    private String title;
    private String content;
    private String deleteYn;

    @Column(name="regist_date")
    private String registDate;


}
