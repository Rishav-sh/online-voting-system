package com.example.voting.config;

import com.example.voting.models.ERole;
import com.example.voting.models.User;
import com.example.voting.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Create default admin user if not exists
        if (!userRepository.existsByEmail("admin@voting.com")) {
            User admin = new User(
                    "Super Admin",
                    "admin@voting.com",
                    passwordEncoder.encode("admin123"),
                    ERole.ROLE_ADMIN
            );
            userRepository.save(admin);
            System.out.println("Default Admin seeded successfully. [Email: admin@voting.com | Pass: admin123]");
        }
    }
}
