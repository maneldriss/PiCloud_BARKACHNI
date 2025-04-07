package projet.barkachni.Controller;

import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import projet.barkachni.Entity.Item;
import projet.barkachni.Service.IItemService;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/item")
public class ItemRestController {
    IItemService itemService;
    @GetMapping("/retrieve-all-items")
    public List<Item> getItems() {
        return itemService.retrieveAllItems();
    }
    @GetMapping("/retrieve-item/{item-id}")
    public ResponseEntity<?> retrieveItem(@PathVariable("item-id") Long iId) {
        try {
            Item item = itemService.retrieveItem(iId);
            return ResponseEntity.ok(item);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Error: " + e.getMessage());
        }
    }
    @PostMapping("/add-item")
    public ResponseEntity<?> addItem(@RequestBody Item i) {
        try {
            Item savedItem = itemService.addItem(i);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedItem);
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
    public ResponseEntity<?> updateItem(@RequestBody Item i) {
        try {
            Item updatedItem = itemService.updateItem(i);
            return ResponseEntity.ok(updatedItem);
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
    @PutMapping("/toggle-favorite/{itemId}")
    public ResponseEntity<Item> toggleFavorite(@PathVariable Long itemId, @RequestParam boolean favorite) {
        try {
            Item item = itemService.retrieveItem(itemId);
            if (item == null) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }

            item.setFavorite(favorite);
            Item updatedItem = itemService.updateItem(item);
            return new ResponseEntity<>(updatedItem, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
