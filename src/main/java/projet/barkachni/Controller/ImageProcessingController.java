package projet.barkachni.Controller;

import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import projet.barkachni.Service.ImageProcessingService;

import java.util.HashMap;
import java.util.Map;

@RestController
@AllArgsConstructor
@RequestMapping("/images")
public class ImageProcessingController {
    private final ImageProcessingService imageProcessingService;

    @PostMapping(value = "/remove-background", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> removeBackground(@RequestParam("image") MultipartFile imageFile) {
        try {
            String processedImageUrl = imageProcessingService.processAndStoreImage(imageFile);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("imageUrl", processedImageUrl);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("error", e.getMessage());

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @GetMapping("/serve/{filename:.+}")
    public ResponseEntity<?> serveImage(@PathVariable String filename) {
        try {
            byte[] imageBytes = imageProcessingService.getStoredImage(filename);
            return ResponseEntity
                    .ok()
                    .contentType(MediaType.IMAGE_PNG)
                    .body(imageBytes);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Image not found: " + e.getMessage());
        }
    }
}
