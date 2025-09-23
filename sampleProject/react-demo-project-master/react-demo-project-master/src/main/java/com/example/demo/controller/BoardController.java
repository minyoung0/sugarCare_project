package com.example.demo.controller;

import com.example.demo.DTO.BoardListDto;
import com.example.demo.entity.Board;
import com.example.demo.entity.CharacterProfile;
import com.example.demo.entity.Board;
import com.example.demo.repository.BoardRepository;
import com.example.demo.repository.CharacterProfileRepository;
import com.example.demo.repository.CommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/board")
@CrossOrigin(origins = "http://localhost:3000")
public class BoardController {

    private final BoardRepository repo;

    @Autowired
    private final CommentRepository commentRepository;

    public BoardController(BoardRepository repo, CommentRepository commentRepository) {
        this.repo = repo;
        this.commentRepository = commentRepository;
    }

    @GetMapping("/list")
    public ResponseEntity<Page<BoardListDto>> getByName(@RequestParam(defaultValue = "0")int page,
                                                 @RequestParam(defaultValue = "10") int size,
                                                 @RequestParam(required = false) String searchType,
                                                 @RequestParam(required = false) String keyword){

    Pageable pageable = PageRequest.of(page, size, Sort.by("registDate").descending());
    Page<Board> result=repo.findByDeleteYn("N", pageable);
        System.out.println("검색 타입:"+searchType);
        System.out.println("검색어: "+keyword);
    if(keyword != null && !keyword.trim().isEmpty()){
        switch (searchType){
            case "title":
                result = repo.findByDeleteYnAndTitleContainingIgnoreCase("N",keyword,pageable);
                break;
            case "content":
                result = repo.findByDeleteYnAndContentContainingIgnoreCase("N",keyword,pageable);
                break;
            case "userId":
                result = repo.findByDeleteYnAndUserIdContainingIgnoreCase("N",keyword,pageable);
                break;
        }
    }
        Page<BoardListDto> dtoPage = result.map(board -> {
            int commentCount = commentRepository.countByBoardIdAndDeleteYn(board.getId(), "N");
            return new BoardListDto(board, commentCount);
        });
    return ResponseEntity.ok(dtoPage);
//        List<Board> posts = repo.findAllNotDelete();
      /*
        System.out.println("controller");
        if (posts.isEmpty()) {
            System.out.println("조회 실패: 게시물이 없습니다.");
            return ResponseEntity.noContent().build(); // 204 No Content
        }

        System.out.println("조회 결과: " + posts.size() + "건");

       */

    }


    @PostMapping("/boardPost")
    public ResponseEntity<Board> writePost(@RequestBody Board board) {
        String today = String.valueOf(LocalDateTime.now());
        if (board.getDeleteYn() == null || board.getDeleteYn().isEmpty()) {
            board.setDeleteYn("N");
        }
        board.setRegistDate(today);
        Board saved = repo.save(board);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Board> getPostById(@PathVariable Long id) {
        System.out.println("불러오기");
        System.out.println("id:"+id);
        Optional<Board> post = repo.findById(id);
        return post.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Board> updatePost(@PathVariable Long id, @RequestBody Board updatedBoard) {
        Optional<Board> existing = repo.findById(id);
        if (existing.isEmpty()) return ResponseEntity.notFound().build();

        Board post = existing.get();
        post.setTitle(updatedBoard.getTitle());
        post.setContent(updatedBoard.getContent());
        post.setUserId(updatedBoard.getUserId());
        post.setRegistDate(String.valueOf(LocalDateTime.now())); // 수정일자 갱신

        return ResponseEntity.ok(repo.save(post));
    }

    @PutMapping("/delete/{id}")
    public ResponseEntity<Board> deletePost(@PathVariable Long id) {
        Optional<Board> post = repo.findById(id);
        if (post.isEmpty()) return ResponseEntity.notFound().build();
        Board board = post.get();
        board.setDeleteYn("Y");
        repo.save(board);

        return ResponseEntity.ok(repo.save(board));
    }
}