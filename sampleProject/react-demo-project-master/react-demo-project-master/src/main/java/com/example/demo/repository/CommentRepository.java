package com.example.demo.repository;

import com.example.demo.entity.Board;
import com.example.demo.entity.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface CommentRepository extends JpaRepository<Comment,Long> {

    List<Comment> findByBoardIdAndDeleteYn(Long boardId,String deleteYn);
    int countByBoardIdAndDeleteYn(Long boardId, String deleteYn);
}
