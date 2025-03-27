package com.barkachni.barkachnipi.services.dressingService;

import com.barkachni.barkachnipi.entities.dressingEntity.ItemDressing;

import java.util.List;

public interface IDressingItemService {
    List<ItemDressing> retrieveAllItems();
    ItemDressing retrieveItem(long ItemId);
    ItemDressing addItem(ItemDressing i);
    void removeItem(long ItemId);
    ItemDressing updateItem(ItemDressing i);
}
