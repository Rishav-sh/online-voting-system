package com.example.voting.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ElectionRequest {
    @NotBlank
    private String title;
}
