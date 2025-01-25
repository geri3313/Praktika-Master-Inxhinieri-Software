package com.example.ticketingsystem.dto;

import com.example.ticketingsystem.entity.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterUserRequest {

    @Email(message = "Invalid email format.")
    @NotBlank(message = "Email is required.")
    private String email;

    @Size(min = 8, message = "Password must be at least 8 characters.")
    @NotBlank(message = "Password is required.")
    private String password;

    private Role role;
}
