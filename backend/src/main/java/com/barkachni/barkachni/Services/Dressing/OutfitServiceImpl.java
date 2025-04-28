package com.barkachni.barkachni.Services.Dressing;

import com.barkachni.barkachni.entities.Dressing.Dressing;
import com.barkachni.barkachni.entities.Dressing.Item;
import com.barkachni.barkachni.entities.Dressing.Outfit;
import com.barkachni.barkachni.entities.user.User;
import com.barkachni.barkachni.entities.user.UserRepository;
import com.barkachni.barkachni.repositories.Dressing.DressingRepository;
import com.barkachni.barkachni.repositories.Dressing.ItemRepository;
import com.barkachni.barkachni.repositories.Dressing.OutfitRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;


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
        System.out.println("Received outfit to add: " + o);
        if (o.getDressing() == null) {
            System.out.println("Dressing is null in the received outfit");
            throw new RuntimeException("Dressing information is required to add an outfit");
        }
        System.out.println("Dressing information: " + o.getDressing());
        try {
            Outfit savedOutfit = outfitRepository.save(o);
            System.out.println("Successfully saved outfit: " + savedOutfit);
            return savedOutfit;
        } catch (Exception e) {
            System.out.println("Error saving outfit: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to save outfit: " + e.getMessage());
        }
    }

    @Override
    public Outfit updateOutfit(Outfit o) {
        Outfit existingOutfit = outfitRepository.findById(o.getOutfitID())
                .orElseThrow(() -> new RuntimeException("Outfit not found with id: " + o.getOutfitID()));
        o.setDressing(existingOutfit.getDressing());
        return outfitRepository.save(o);
    }

    @Override
    public void removeOutfit(long outfitId) {
        Outfit outfit = retrieveOutfit(outfitId);
        
        if (outfit.getItems() != null) {
            outfit.getItems().clear();
        }
        
        outfit.setDressing(null);
        
        outfitRepository.save(outfit);
        
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
    public List<Outfit> retrieveOutfitsByUserId(Integer userID) {
        return outfitRepository.findByDressingUserId(userID);
    }
}
