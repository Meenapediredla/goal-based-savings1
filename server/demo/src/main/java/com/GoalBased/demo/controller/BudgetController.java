package com.GoalBased.demo.controller;

import com.GoalBased.demo.entity.BudgetPlan;
import com.GoalBased.demo.entity.Expense;
import com.GoalBased.demo.service.BudgetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.YearMonth;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/budget")
public class BudgetController {

    @Autowired
    private BudgetService budgetService;

    private String requireEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()
                || "anonymousUser".equals(authentication.getPrincipal())) {
            return null;
        }
        return authentication.getName();
    }

    private String resolveMonth(String month) {
        if (month != null && !month.isBlank()) {
            return month;
        }
        return YearMonth.now().toString();
    }

    @GetMapping("/plan")
    public ResponseEntity<?> getPlan(@RequestParam(required = false) String month) {
        String email = requireEmail();
        if (email == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Unauthorized access"));
        }
        String resolvedMonth = resolveMonth(month);
        BudgetPlan plan = budgetService.getOrCreatePlan(email, resolvedMonth);
        return ResponseEntity.ok(plan);
    }

    @PutMapping("/plan")
    public ResponseEntity<?> updatePlan(@RequestBody Map<String, Object> body) {
        String email = requireEmail();
        if (email == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Unauthorized access"));
        }
        String resolvedMonth = resolveMonth((String) body.get("month"));
        Double income = body.get("monthlyIncome") != null
                ? Double.valueOf(body.get("monthlyIncome").toString()) : null;
        Double limit = body.get("monthlyBudgetLimit") != null
                ? Double.valueOf(body.get("monthlyBudgetLimit").toString()) : null;
        BudgetPlan plan = budgetService.savePlan(email, resolvedMonth, income, limit);
        return ResponseEntity.ok(plan);
    }

    @GetMapping("/expenses")
    public ResponseEntity<?> getExpenses(@RequestParam(required = false) String month) {
        String email = requireEmail();
        if (email == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Unauthorized access"));
        }
        List<Expense> expenses = budgetService.getExpensesForMonth(email, resolveMonth(month));
        return ResponseEntity.ok(expenses);
    }

    @PostMapping("/expenses")
    public ResponseEntity<?> addExpense(@RequestBody Expense expense) {
        String email = requireEmail();
        if (email == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Unauthorized access"));
        }
        expense.setEmail(email);
        Expense saved = budgetService.addExpense(expense);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/expenses/{id}")
    public ResponseEntity<?> deleteExpense(@PathVariable Long id) {
        String email = requireEmail();
        if (email == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Unauthorized access"));
        }
        Expense expense = budgetService.getExpenseById(id);
        if (expense == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Expense not found"));
        }
        if (!email.equals(expense.getEmail())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Not allowed"));
        }
        budgetService.deleteExpense(id);
        return ResponseEntity.ok().build();
    }
}
