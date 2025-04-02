package com.smhrd.repository;

import com.smhrd.model.News;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NewsRepository extends JpaRepository<News, Long> {
    
    @Query("SELECT n FROM News n WHERE " +
           "n.dates = :date OR " +
           "n.dates LIKE CONCAT(:date, ',%') OR " +
           "n.dates LIKE CONCAT('%,', :date) OR " +
           "n.dates LIKE CONCAT('%,', :date, ',%') OR " +
           "n.dates LIKE CONCAT('%,', :date)")
    List<News> findNewsByDate(@Param("date") String date);
    
    @Query("SELECT n FROM News n WHERE n.dates LIKE %:date% AND n.category = :category")
    List<News> findNewsByDateAndCategory(@Param("date") String date, @Param("category") String category);
    
    @Query("SELECT n FROM News n WHERE n.dates LIKE %:date% AND n.category IN :categories")
    List<News> findNewsByDateAndCategories(@Param("date") String date, @Param("categories") List<String> categories);
}