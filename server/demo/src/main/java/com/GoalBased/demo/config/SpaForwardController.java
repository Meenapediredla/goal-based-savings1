package com.GoalBased.demo.config;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * Serves the React SPA for client-side routes when the UI is bundled in static/.
 */
@Controller
public class SpaForwardController {

    @GetMapping({
            "/",
            "/login",
            "/register",
            "/dashboard",
            "/addgoal"
    })
    public String forwardSpaRoutes() {
        return "forward:/index.html";
    }
}
