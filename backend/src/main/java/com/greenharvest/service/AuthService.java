package com.greenharvest.service;

import com.greenharvest.dto.AuthResponse;
import com.greenharvest.dto.LoginRequest;
import com.greenharvest.dto.RegisterRequest;
import com.greenharvest.dto.UserDto;
import com.greenharvest.entity.Role;
import com.greenharvest.entity.User;
import com.greenharvest.exception.ConflictException;
import com.greenharvest.exception.ResourceNotFoundException;
import com.greenharvest.repository.UserRepository;
import com.greenharvest.security.JwtService;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository users;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UserRepository users, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.users = users;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Transactional
    public AuthResponse register(RegisterRequest req) {
        String email = normalize(req.email());
        if (users.existsByEmail(email)) {
            throw new ConflictException("An account with this email already exists");
        }
        User user = new User();
        user.setFullName(req.fullName().trim());
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(req.password()));
        user.setRole(Role.CUSTOMER);          // always CUSTOMER, whatever the client sends
        users.save(user);
        return new AuthResponse(jwtService.generateToken(user.getEmail(), user.getRole().name()), UserDto.from(user));
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest req) {
        User user = users.findByEmail(normalize(req.email()))
                .filter(u -> passwordEncoder.matches(req.password(), u.getPasswordHash()))
                .orElseThrow(() -> new BadCredentialsException("Invalid email or password"));
        return new AuthResponse(jwtService.generateToken(user.getEmail(), user.getRole().name()), UserDto.from(user));
    }

    @Transactional(readOnly = true)
    public UserDto me(String email) {
        return users.findByEmail(email)
                .map(UserDto::from)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private static String normalize(String email) {
        return email.trim().toLowerCase();
    }
}
