package com.GoalBased.demo.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "budget_plans", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"email", "month"})
})
public class BudgetPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String email;

    /** Format: YYYY-MM */
    private String month;

    private Double monthlyIncome = 0.0;

    private Double monthlyBudgetLimit = 0.0;

    public BudgetPlan() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getMonth() { return month; }
    public void setMonth(String month) { this.month = month; }

    public Double getMonthlyIncome() { return monthlyIncome; }
    public void setMonthlyIncome(Double monthlyIncome) { this.monthlyIncome = monthlyIncome; }

    public Double getMonthlyBudgetLimit() { return monthlyBudgetLimit; }
    public void setMonthlyBudgetLimit(Double monthlyBudgetLimit) { this.monthlyBudgetLimit = monthlyBudgetLimit; }
}
