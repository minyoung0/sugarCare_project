package com.example.demo.controller;

import com.example.demo.entity.Board;
import com.example.demo.entity.Comment;
import com.example.demo.repository.BoardRepository;
import com.example.demo.repository.CommentRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/comments")
@CrossOrigin(origins = "http://localhost:3000")
public class CommentController {

    private final CommentRepository repo;

    public CommentController(CommentRepository repo) {
        this.repo = repo;
    }

    @GetMapping("/{boardId}")
    public ResponseEntity<List<Comment>> getComments(@PathVariable Long boardId){
        List<Comment> comments=repo.findByBoardIdAndDeleteYn(boardId,"N");
        return ResponseEntity.ok(comments);
    }
    @PostMapping
    public ResponseEntity<Comment> addComment(@RequestBody Comment comment){
        comment.setRegistDate(String.valueOf(LocalDateTime.now()));
        comment.setDeleteYn("N");
        return ResponseEntity.ok(repo.save(comment));
    }


}