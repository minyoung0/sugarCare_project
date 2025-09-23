package com.example.demo.DTO;

import com.example.demo.entity.Board;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


public class BoardListDto {
    private Long id;
    private String title;
    private String content;
    private String userId;
    private String registDate;
    private int commentCount; // 댓글 수

    public BoardListDto() {
    }

    ;

    // 생성자
    public BoardListDto(Board board, int commentCount) {
        this.id = board.getId();
        this.title = board.getTitle();
        this.content = board.getContent();
        this.userId = board.getUserId();
        this.registDate = board.getRegistDate();
        this.commentCount = commentCount;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getRegistDate() {
        return registDate;
    }

    public void setRegistDate(String registDate) {
        this.registDate = registDate;
    }

    public int getCommentCount() {
        return commentCount;
    }

    public void setCommentCount(int commentCount) {
        this.commentCount = commentCount;
    }

}
