package com.GoalBased.demo.repository;

import com.GoalBased.demo.entity.Expense;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    List<Expense> findByEmailAndExpenseDateStartingWith(String email, String monthPrefix);
}
