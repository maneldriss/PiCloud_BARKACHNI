package com.barkachni.barkachni.handler;
import com.barkachni.barkachni.entities.role.RoleName;
import com.barkachni.barkachni.entities.role.RoleRepository;
import com.barkachni.barkachni.entities.user.User;
import com.barkachni.barkachni.entities.user.UserRepository;
import com.barkachni.barkachni.security.JwtService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {
    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String email = oAuth2User.getAttribute("email");

        if (email == null) {
            logger.error("Email not found in OAuth2User attributes");
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Email not found");
            return;
        }

        User user = userRepository.findByEmail(email)
                .orElseGet(() -> {
                    Map<String, Object> attributes = oAuth2User.getAttributes();
                    User newUser = User.builder()
                            .email(email)
                            .firstname(getAttribute(attributes, "given_name", "name"))
                            .lastname(getAttribute(attributes, "family_name", ""))
                            .enabled(true)
                            .accountLocked(false)
                            .roles(List.of(roleRepository.findByName(RoleName.USER)
                                    .orElseThrow(() -> new RuntimeException("ROLE USER not found"))))
                            .build();
                    return userRepository.save(newUser);
                });

        String jwtToken = jwtService.generateToken(user);
        String redirectUrl = "http://localhost:4200/oauth-redirect?token=" + jwtToken;
        getRedirectStrategy().sendRedirect(request, response, redirectUrl);
    }

    private String getAttribute(Map<String, Object> attributes, String key, String defaultValue) {
        Object value = attributes.get(key);
        return value != null ? value.toString() : defaultValue;
    }
}