package com.example.voting.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "elections")
@Data
@NoArgsConstructor
public class Election {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String title;

    @Enumerated(EnumType.STRING)
    private ElectionStatus status;

    private LocalDateTime startDate;
    private LocalDateTime endDate;

    public Election(String title, ElectionStatus status, LocalDateTime startDate, LocalDateTime endDate) {
        this.title = title;
        this.status = status;
        this.startDate = startDate;
        this.endDate = endDate;
    }
}
