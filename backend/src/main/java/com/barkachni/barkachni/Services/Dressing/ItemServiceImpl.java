package com.barkachni.barkachni.Services.Dressing;

import com.barkachni.barkachni.entities.Dressing.Item;
import com.barkachni.barkachni.entities.user.User;
import com.barkachni.barkachni.entities.user.UserRepository;
import com.barkachni.barkachni.repositories.Dressing.ItemRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@AllArgsConstructor
@Service
public class ItemServiceImpl implements IItemService {
    private final ItemRepository itemRepository;
    private final UserRepository userRepository;
    @Override
    public List<Item> retrieveAllItems() {
        return itemRepository.findAll();
    }

    @Override
    public Item retrieveItem(long itemId) {
        return itemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item not found with id: " + itemId));
    }

    @Override
    public Item addItem(Item i, Integer userId) {
        User currentUser = userRepository.findById(userId)
                .orElseThrow(() -> new UsernameNotFoundException("Authenticated user not found"));

        i.setUser(currentUser);
        return itemRepository.save(i);
    }

    @Override
    public Item updateItem(Item i) {
        Item existingItem = itemRepository.findById(i.getItemID())
                .orElseThrow(() -> new RuntimeException("Item not found with id: " + i.getItemID()));
        i.setUser(existingItem.getUser());
        return itemRepository.save(i);
    }

    @Override
    @Transactional
    public void removeItem(long itemId) {
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item not found with id: " + itemId));
        
        if (item.getOutfits() != null && !item.getOutfits().isEmpty()) {
            throw new RuntimeException("Cannot delete item because it is being used in one or more outfits");
        }
        
        if (item.getUser() != null) {
            User user = item.getUser();
            user.getItems().removeIf(i -> i.getItemID().equals(itemId));
            userRepository.save(user);
        }
        
        itemRepository.deleteById(itemId);
    }

    @Override
    public List<Item> retrieveItemsByUser(Integer userID) {
        List<Item> items = itemRepository.findByUserId(userID);
        // Initialize the outfits collection for each item
        items.forEach(item -> {
            if (item.getOutfits() == null) {
                item.setOutfits(new ArrayList<>());
            }
            item.getOutfits().size(); // This will trigger the lazy loading
        });
        return items;
    }
}
