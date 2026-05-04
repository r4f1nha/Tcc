package com.moduloAi.TCC.service;

import com.moduloAi.TCC.domain.User;
import com.moduloAi.TCC.dto.UserRequest;
import com.moduloAi.TCC.dto.UserResponse;
import com.moduloAi.TCC.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private static final String DEFAULT_TENANT_ID = "tenant-001";

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<UserResponse> list() {
        return userRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public UserResponse findById(Long id) {
        return userRepository.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new EntityNotFoundException("User not found: " + id));
    }

    public UserResponse create(UserRequest request) {
        if (userRepository.findByEmail(request.email()).isPresent()) {
            throw new IllegalArgumentException("Email already in use: " + request.email());
        }

        if (request.password() == null || request.password().isBlank()) {
            throw new IllegalArgumentException("Password is required");
        }

        User user = new User(
                request.name(),
                request.email(),
                request.phone(),
                request.role(),
                passwordEncoder.encode(request.password()),
                DEFAULT_TENANT_ID
        );

        user.setActive(true);

        return toResponse(userRepository.save(user));
    }

    public UserResponse update(Long id, UserRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("User not found: " + id));

        user.setName(request.name());
        user.setEmail(request.email());
        user.setPhone(request.phone());
        user.setRole(request.role());

        if (request.password() != null && !request.password().isBlank()) {
            user.setPasswordHash(passwordEncoder.encode(request.password()));
        }

        if (user.getTenantId() == null || user.getTenantId().isBlank()) {
            user.setTenantId(DEFAULT_TENANT_ID);
        }

        return toResponse(userRepository.save(user));
    }

    public UserResponse deactivate(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("User not found: " + id));

        user.setActive(false);

        return toResponse(userRepository.save(user));
    }

    public UserResponse activate(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("User not found: " + id));

        user.setActive(true);

        return toResponse(userRepository.save(user));
    }

    public void delete(Long id) {
        if (!userRepository.existsById(id)) {
            throw new EntityNotFoundException("User not found: " + id);
        }

        userRepository.deleteById(id);
    }

    private UserResponse toResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getPhone(),
                user.getRole(),
                user.isActive(),
                user.getCreatedAt()
        );
    }
}