package com.GoalBased.demo.controller;

import com.GoalBased.demo.entity.User;
import com.GoalBased.demo.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/users")

public class UserController {

    @Autowired
    private UserService userService;

    // REGISTER USER
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        try {
            User savedUser = userService.saveUser(user);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedUser);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        }
    }

    // LOGIN USER
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(
            @RequestBody User user) {

        User loggedInUser =
                userService.login(
                        user.getEmail(),
                        user.getPassword());

        // SUCCESS
        if (loggedInUser != null) {

            return ResponseEntity.ok(
                    loggedInUser);
        }

        // FAILED
        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body("Invalid Credentials");
    }

    // GET ALL USERS
    @GetMapping
    public List<User> getUsers() {

        return userService.getUsers();
    }
}