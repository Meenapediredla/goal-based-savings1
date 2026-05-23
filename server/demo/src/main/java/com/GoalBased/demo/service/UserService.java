package com.GoalBased.demo.service;

import com.GoalBased.demo.entity.User;
import com.GoalBased.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    // LOGIN
    public User login(String email, String password) {
        User user = userRepository.findFirstByEmailOrderByIdDesc(email).orElse(null);

        if (user != null && passwordEncoder.matches(password, user.getPassword())) {
            return user;
        }
        return null;
    }

    // REGISTER - idi ledu kabatti error vastondi
    public User saveUser(User user) {
        if (user.getEmail() == null || user.getEmail().isBlank()) {
            throw new IllegalArgumentException("Email is required");
        }
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new IllegalArgumentException("Email already registered");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    // GET ALL USERS - idi kuda ledu
    public List<User> getUsers() {
        return userRepository.findAll();
    }
}