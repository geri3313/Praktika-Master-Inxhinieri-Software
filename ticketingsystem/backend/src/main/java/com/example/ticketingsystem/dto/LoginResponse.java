package com.example.ticketingsystem.dto;

import com.example.ticketingsystem.entity.User;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class LoginResponse {
    private String token;
    private User user;
}
