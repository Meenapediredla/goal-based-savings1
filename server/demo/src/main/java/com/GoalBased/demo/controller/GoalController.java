package com.GoalBased.demo.controller;

import com.GoalBased.demo.entity.Goal;
import com.GoalBased.demo.service.GoalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/goals")
@CrossOrigin("*")
public class GoalController {

    @Autowired
    private GoalService goalService;

    @PostMapping
    public ResponseEntity<?> addGoal(@RequestBody Goal goal) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Unauthorized access"));
        }
        String email = authentication.getName();
        goal.setEmail(email);
        Goal savedGoal = goalService.save(goal);
        return ResponseEntity.ok(savedGoal);
    }

    @GetMapping
    public ResponseEntity<?> getMyGoals() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Unauthorized access"));
        }
        String email = authentication.getName();
        List<Goal> goals = goalService.getGoalsByEmail(email);
        return ResponseEntity.ok(goals);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteGoal(@PathVariable Long id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Unauthorized access"));
        }
        String email = authentication.getName();
        Goal goal = goalService.getGoalById(id);
        if (goal == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Goal not found"));
        }
        if (!email.equals(goal.getEmail())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Not allowed to delete this goal"));
        }
        goalService.deleteGoal(id);
        return ResponseEntity.ok().build();
    }
}