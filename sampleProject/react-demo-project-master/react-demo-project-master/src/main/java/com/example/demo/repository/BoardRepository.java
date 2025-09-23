package com.example.demo.repository;

import com.example.demo.DTO.BoardListDto;
import com.example.demo.entity.Board;
import com.example.demo.entity.CharacterProfile;
import com.example.demo.entity.Board;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface BoardRepository extends JpaRepository<Board,Long> {

    @Query("Select b From Board b WHERE b.deleteYn='N' ORDER BY b.registDate ASC")
    Page<Board> findAllNotDelete(String deleteYn, Pageable pageable);

    Optional<Board> findById(Long id);

    Page<Board> findByDeleteYn(String deleteYn, Pageable pageable);
    Page<Board> findByDeleteYnAndTitleContainingIgnoreCase(String deleteYn,String title, Pageable pageable);
    Page<Board> findByDeleteYnAndContentContainingIgnoreCase(String deleteYn,String content, Pageable pageable);
    Page<Board> findByDeleteYnAndUserIdContainingIgnoreCase(String deleteYn,String userId, Pageable pageable);
}
