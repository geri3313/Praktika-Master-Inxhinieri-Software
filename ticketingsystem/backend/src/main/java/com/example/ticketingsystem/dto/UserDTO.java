package com.example.ticketingsystem.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserDTO {

    private String email;
    private String password;
    private String role;
    private Long user_id;
}