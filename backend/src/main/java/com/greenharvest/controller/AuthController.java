package com.greenharvest.controller;

import com.greenharvest.dto.AuthResponse;
import com.greenharvest.dto.LoginRequest;
import com.greenharvest.dto.RegisterRequest;
import com.greenharvest.dto.UserDto;
import com.greenharvest.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.register(request));
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }

    /** Returns the currently logged-in user (used by React to restore the session after a refresh). */
    @GetMapping("/me")
    public UserDto me(Authentication authentication) {
        return authService.me(authentication.getName());
    }
}
