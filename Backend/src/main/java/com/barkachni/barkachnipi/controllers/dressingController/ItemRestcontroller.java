package com.barkachni.barkachnipi.controllers.dressingController;

import com.barkachni.barkachnipi.entities.dressingEntity.ItemDressing;
import com.barkachni.barkachnipi.services.dressingService.IDressingItemService;
import com.barkachni.barkachnipi.services.dressingService.IDressingService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/itemDressing")
public class ItemRestcontroller {
    @Autowired
     IDressingItemService itemService;
    private IDressingService dressingService;
    @GetMapping("/retrieve-all-items")
    public ResponseEntity<?> getAllItems() {
        try {
            return ResponseEntity.ok(itemService.retrieveAllItems());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error retrieving items: " + e.getMessage());
        }
    }
    @GetMapping("/retrieve-item/{item-id}")
    public ResponseEntity<?> retrieveItem(@PathVariable("item-id") Long iId) {
        try {
            ItemDressing itemDressing = itemService.retrieveItem(iId);
            return ResponseEntity.ok(itemDressing);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Error: " + e.getMessage());
        }
    }
    @PostMapping("/add-item")
    public ResponseEntity<?> addItem(@RequestBody ItemDressing i) {
        try {
            ItemDressing savedItemDressing = itemService.addItem(i);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedItemDressing);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Validation error: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error adding item: " + e.getMessage());
        }
    }
    @DeleteMapping("/remove-item/{item-id}")
    public ResponseEntity<?> removeItem(@PathVariable("item-id") Long iId) {
        try {
            itemService.removeItem(iId);
            return ResponseEntity.ok("Item with ID " + iId + " successfully deleted");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Error: " + e.getMessage());
        }
    }
    @PutMapping("/update-item")
    public ResponseEntity<?> updateItem(@RequestBody ItemDressing i) {
        try {
            ItemDressing updatedItemDressing = itemService.updateItem(i);
            return ResponseEntity.ok(updatedItemDressing);
        } catch (RuntimeException e) {
            if (e instanceof IllegalArgumentException) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Validation error: " + e.getMessage());
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Error: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating item: " + e.getMessage());
        }
    }
}
