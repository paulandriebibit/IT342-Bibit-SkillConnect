package edu.cit.bibit.skillconnect.features.config;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import edu.cit.bibit.skillconnect.features.auth.User;
import edu.cit.bibit.skillconnect.features.auth.UserRepository;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    @Autowired
    private UserRepository userRepository;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {
        
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        Map<String, Object> attributes = oAuth2User.getAttributes();

        String email = (String) attributes.get("email");
        String rawFirstName = (String) attributes.get("given_name");
        String alternateName = (String) attributes.get("name");
        String rawLastName = (String) attributes.get("family_name");
        String picture = (String) attributes.get("picture");

        if (email == null) {
            response.sendRedirect("http://localhost:3000/login?error=oauth_email_missing");
            return;
        }

        User user = userRepository.findByEmail(email).orElseGet(() -> {
            User newUser = new User();
            newUser.setEmail(email);
            
            String resolvedFirst = rawFirstName;
            if (resolvedFirst == null) {
                resolvedFirst = alternateName;
            }
            if (resolvedFirst == null) {
                resolvedFirst = "CIT-U";
            }
            newUser.setFirstname(resolvedFirst);

            String resolvedLast = rawLastName;
            if (resolvedLast == null) {
                resolvedLast = "Student";
            }
            newUser.setLastname(resolvedLast);

            newUser.setRole("STUDENT");
            newUser.setMajor("CCS"); 
            newUser.setProfileImage(picture);
            newUser.setCreatedAt(LocalDateTime.now().toString());
            newUser.setPassword("OAUTH_EXTERNAL_ACCOUNT_USER");
            return userRepository.save(newUser);
        });

        String redirectUrl = String.format(
            "http://localhost:3000/login?oauth_success=true&id=%d&firstname=%s&lastname=%s&email=%s&role=%s&major=%s",
            user.getId(),
            user.getFirstname(),
            user.getLastname(),
            user.getEmail(),
            user.getRole(),
            user.getMajor()
        );

        getRedirectStrategy().sendRedirect(request, response, redirectUrl);
    }
}