package com.barkachni.barkachni.Services.Dressing;


import com.barkachni.barkachni.entities.Dressing.Item;
import com.barkachni.barkachni.entities.user.User;

import java.util.List;

public interface IItemService {
    List<Item> retrieveAllItems();
    Item retrieveItem(long ItemId);
    Item addItem(Item i, Integer userId);
    void removeItem(long ItemId);
    Item updateItem(Item i);
    List<Item> retrieveItemsByUser(Integer userID);
}
