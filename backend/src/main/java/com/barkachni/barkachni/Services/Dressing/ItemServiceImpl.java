package com.barkachni.barkachni.Services.Dressing;

import com.barkachni.barkachni.entities.Dressing.Item;
import com.barkachni.barkachni.entities.user.User;
import com.barkachni.barkachni.entities.user.UserRepository;
import com.barkachni.barkachni.repositories.Dressing.ItemRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;


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
        itemRepository.findById(i.getItemID())
                .orElseThrow(() -> new RuntimeException("Item not found with id: " + i.getItemID()));
        User user = userRepository.findById(1)
                .orElseThrow(() -> new RuntimeException("User not found with id: 1"));
        i.setUser(user);
        return itemRepository.save(i);
    }

    @Override
    public void removeItem(long itemId) {
        itemRepository.deleteById(itemId);
    }

    @Override
    public List<Item> retrieveItemsByUser(Integer userID) {
        return itemRepository.findByUserId(userID);
    }
}
