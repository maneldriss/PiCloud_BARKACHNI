package com.barkachni.barkachni.auth;

import com.barkachni.barkachni.entities.user.User;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class AuthenticationResponse {
    private String token;
    private User user;
}
