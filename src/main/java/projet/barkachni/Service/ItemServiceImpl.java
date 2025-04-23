package projet.barkachni.Service;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import projet.barkachni.Entity.Item;
import projet.barkachni.Entity.User;
import projet.barkachni.Repository.ItemRepository;
import projet.barkachni.Repository.UserRepository;

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
    public Item addItem(Item i) {
        User user = userRepository.findById(1L)
                .orElseThrow(() -> new RuntimeException("User not found with id: 1"));
        i.setUser(user);
        return itemRepository.save(i);
    }

    @Override
    public Item updateItem(Item i) {
        itemRepository.findById(i.getItemID())
                .orElseThrow(() -> new RuntimeException("Item not found with id: " + i.getItemID()));
        User user = userRepository.findById(1L)
                .orElseThrow(() -> new RuntimeException("User not found with id: 1"));
        i.setUser(user);
        return itemRepository.save(i);
    }

    @Override
    public void removeItem(long itemId) {
        itemRepository.deleteById(itemId);
    }

    @Override
    public List<Item> retrieveItemsByUserId(Long userID) {
        return itemRepository.findByUser_UserID(userID);
    }
}
