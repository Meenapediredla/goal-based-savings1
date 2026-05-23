package com.GoalBased.demo.repository;

import com.GoalBased.demo.entity.BudgetPlan;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BudgetPlanRepository extends JpaRepository<BudgetPlan, Long> {
    Optional<BudgetPlan> findByEmailAndMonth(String email, String month);
}
