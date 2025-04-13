package com.barkachni.barkachni.PasswordReset.DTOs;

public record ResetPasswordRequest(
        String token,
        String newPassword,
        String confirmPassword
) {}