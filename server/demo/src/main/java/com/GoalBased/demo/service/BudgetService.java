package com.GoalBased.demo.service;

import com.GoalBased.demo.entity.BudgetPlan;
import com.GoalBased.demo.entity.Expense;
import com.GoalBased.demo.repository.BudgetPlanRepository;
import com.GoalBased.demo.repository.ExpenseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BudgetService {

    @Autowired
    private BudgetPlanRepository budgetPlanRepository;

    @Autowired
    private ExpenseRepository expenseRepository;

    public BudgetPlan getOrCreatePlan(String email, String month) {
        return budgetPlanRepository.findByEmailAndMonth(email, month)
                .orElseGet(() -> {
                    BudgetPlan plan = new BudgetPlan();
                    plan.setEmail(email);
                    plan.setMonth(month);
                    plan.setMonthlyIncome(0.0);
                    plan.setMonthlyBudgetLimit(0.0);
                    return budgetPlanRepository.save(plan);
                });
    }

    public BudgetPlan savePlan(String email, String month, Double income, Double budgetLimit) {
        BudgetPlan plan = getOrCreatePlan(email, month);
        if (income != null) {
            plan.setMonthlyIncome(income);
        }
        if (budgetLimit != null) {
            plan.setMonthlyBudgetLimit(budgetLimit);
        }
        return budgetPlanRepository.save(plan);
    }

    public List<Expense> getExpensesForMonth(String email, String month) {
        return expenseRepository.findByEmailAndExpenseDateStartingWith(email, month);
    }

    public Expense addExpense(Expense expense) {
        return expenseRepository.save(expense);
    }

    public Expense getExpenseById(Long id) {
        return expenseRepository.findById(id).orElse(null);
    }

    public void deleteExpense(Long id) {
        expenseRepository.deleteById(id);
    }
}
