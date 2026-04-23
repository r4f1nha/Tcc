package com.moduloAi.TCC.dto.auth;

import com.moduloAi.TCC.dto.UserResponse;

public record LoginResponse(
        UserResponse user,
        String accessToken
) {}
