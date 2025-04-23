package projet.barkachni.Service;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import projet.barkachni.Entity.Dressing;
import projet.barkachni.Entity.Item;
import projet.barkachni.Entity.Outfit;
import projet.barkachni.Entity.User;
import projet.barkachni.Repository.DressingRepository;
import projet.barkachni.Repository.ItemRepository;
import projet.barkachni.Repository.OutfitRepository;
import projet.barkachni.Repository.UserRepository;

import java.util.ArrayList;
import java.util.List;

@Service
@AllArgsConstructor
public class OutfitServiceImpl implements IOutfitService {
    private final OutfitRepository outfitRepository;
    private final UserRepository userRepository;
    private final DressingRepository dressingRepository;
    private final ItemRepository itemRepository;

    @Override
    public List<Outfit> retrieveAllOutfits() {
        return outfitRepository.findAll();
    }

    @Override
    public Outfit retrieveOutfit(long outfitId) {
        return outfitRepository.findById(outfitId)
                .orElseThrow(() -> new RuntimeException("Outfit not found with id: " + outfitId));
    }

    @Override
    public Outfit addOutfit(Outfit o) {
        User user = userRepository.findById(1L)
                .orElseThrow(() -> new RuntimeException("User not found with id: 1"));
        Dressing dressing = user.getDressing();
        o.setDressing(dressing);
        return outfitRepository.save(o);
    }

    @Override
    public Outfit updateOutfit(Outfit o) {
        outfitRepository.findById(o.getOutfitID())
                .orElseThrow(() -> new RuntimeException("Outfit not found with id: " + o.getOutfitID()));
        User user = userRepository.findById(1L)
                .orElseThrow(() -> new RuntimeException("User not found with id: 1"));
        Dressing dressing = user.getDressing();
        o.setDressing(dressing);
        return outfitRepository.save(o);
    }

    @Override
    public void removeOutfit(long outfitId) {
        outfitRepository.deleteById(outfitId);
    }

    @Override
    public Outfit assignOutfitToDressing(Long outfitId, Long dressingId) {
        Outfit outfit = retrieveOutfit(outfitId);
        Dressing dressing = dressingRepository.findById(dressingId)
                .orElseThrow(() -> new RuntimeException("Dressing not found with id: " + dressingId));

        outfit.setDressing(dressing);
        return outfitRepository.save(outfit);
    }

    @Override
    public Outfit removeOutfitFromDressing(Long outfitId) {
        Outfit outfit = retrieveOutfit(outfitId);
        outfit.setDressing(null);
        return outfitRepository.save(outfit);
    }

    @Override
    public Outfit addItemToOutfit(Long outfitId, Long itemId) {
        Outfit outfit = retrieveOutfit(outfitId);
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item not found with id: " + itemId));

        if (outfit.getItems() == null) {
            outfit.setItems(new ArrayList<>());
        }

        if (!outfit.getItems().contains(item)) {
            outfit.getItems().add(item);
        }

        return outfitRepository.save(outfit);
    }

    @Override
    public Outfit removeItemFromOutfit(Long outfitId, Long itemId) {
        Outfit outfit = retrieveOutfit(outfitId);

        if (outfit.getItems() != null) {
            outfit.getItems().removeIf(i -> i.getItemID().equals(itemId));
        }

        return outfitRepository.save(outfit);
    }

    @Override
    public List<Outfit> retrieveOutfitsByUserId(Long userID) {
        return outfitRepository.findByDressing_User_UserID(userID);
    }
}
