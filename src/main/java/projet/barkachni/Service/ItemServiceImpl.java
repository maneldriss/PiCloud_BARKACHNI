package projet.barkachni.Service;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import projet.barkachni.Entity.Item;
import projet.barkachni.Repository.ItemRepository;

import java.util.List;

@AllArgsConstructor
@Service
public class ItemServiceImpl implements IItemService {
    private final ItemRepository itemRepository;
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
    public Item addItem(Item i) {
        return itemRepository.save(i);
    }

    @Override
    public Item updateItem(Item i) {
        itemRepository.findById(i.getItemID())
                .orElseThrow(() -> new RuntimeException("Item not found with id: " + i.getItemID()));
        return itemRepository.save(i);
    }

    @Override
    public void removeItem(long itemId) {
        itemRepository.deleteById(itemId);
    }
}
