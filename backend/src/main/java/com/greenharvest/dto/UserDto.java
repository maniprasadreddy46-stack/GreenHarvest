package com.greenharvest.dto;

import com.greenharvest.entity.User;

public record UserDto(Long id, String fullName, String email, String role) {

    public static UserDto from(User u) {
        return new UserDto(u.getId(), u.getFullName(), u.getEmail(), u.getRole().name());
    }
}
