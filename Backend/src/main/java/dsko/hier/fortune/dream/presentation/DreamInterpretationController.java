package dsko.hier.fortune.dream.presentation;

import dsko.hier.fortune.dream.application.DreamInterpreationService;
import dsko.hier.fortune.dream.dto.request.DreamRequestDto;
import dsko.hier.fortune.dream.dto.response.DreamResponse;
import dsko.hier.global.response.APIResponse;
import dsko.hier.security.application.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/api/fortune/dream")
@RequiredArgsConstructor
public class DreamInterpretationController {

    private final DreamInterpreationService service;

    @PostMapping
    public APIResponse<DreamResponse> interpretDream(
            @Validated @RequestBody DreamRequestDto req,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {

        DreamResponse dreamResponseFromAI = service.getDreamResponseFromAI(userDetails.getUsername(), req);

        return APIResponse.success(dreamResponseFromAI);
    }
}
