package com.barkachni.barkachnipi.services.dressingService;

import com.barkachni.barkachnipi.entities.dressingEntity.ItemDressing;
import com.barkachni.barkachnipi.repositories.dressingRepository.ItemDressingRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@AllArgsConstructor
@Service
public class ItemDressingService implements IDressingItemService {
    ItemDressingRepository itemRepository;

    @Override
    public List<ItemDressing> retrieveAllItems() {
        return itemRepository.findAll();
    }

    @Override
    public ItemDressing retrieveItem(long itemId) {
        return itemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item not found with id: " + itemId));
    }

    @Override
    public ItemDressing addItem(ItemDressing i) {
        return itemRepository.save(i);
    }

    @Override
    public ItemDressing updateItem(ItemDressing i) {
        itemRepository.findById(i.getItemID())
                .orElseThrow(() -> new RuntimeException("Item not found with id: " + i.getItemID()));
        return itemRepository.save(i);
    }

    @Override
    public void removeItem(long itemId) {
        itemRepository.deleteById(itemId);
    }

}
