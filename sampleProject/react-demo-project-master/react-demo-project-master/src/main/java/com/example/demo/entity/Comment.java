package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Entity
@Getter
@Setter
@Table(name="comment")
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long commentId;
    private Long boardId; // 어떤 게시글의 댓글인지

    private Long parentId;
    private String userId;
    private String comment;
    private String deleteYn;

    @Column(name="regist_date")
    private String registDate;

    @Column(name="update_date")
    private String updateDate;


}
