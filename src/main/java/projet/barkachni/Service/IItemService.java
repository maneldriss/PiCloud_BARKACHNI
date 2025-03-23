package projet.barkachni.Service;

import projet.barkachni.Entity.Item;

import java.util.List;

public interface IItemService {
    List<Item> retrieveAllItems();
    Item retrieveItem(long ItemId);
    Item addItem(Item i);
    void removeItem(long ItemId);
    Item updateItem(Item i);
}
