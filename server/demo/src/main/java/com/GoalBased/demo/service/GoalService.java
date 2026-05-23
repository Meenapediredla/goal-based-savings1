package com.GoalBased.demo.service;

import com.GoalBased.demo.entity.Goal;
import com.GoalBased.demo.repository.GoalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class GoalService {

    @Autowired
    private GoalRepository goalRepository;

    public Goal save(Goal goal) {
        return goalRepository.save(goal);
    }

    public List<Goal> getGoalsByEmail(String email) {
        return goalRepository.findByEmail(email);
    }

    public Goal getGoalById(Long id) {
        return goalRepository.findById(id).orElse(null);
    }

    public void deleteGoal(Long id) {
        goalRepository.deleteById(id);
    }
}