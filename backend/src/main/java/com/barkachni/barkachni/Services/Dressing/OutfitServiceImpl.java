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
        
        // Debug items being received
        if (o.getItems() != null) {
            System.out.println("Items count: " + o.getItems().size());
            o.getItems().forEach(item -> {
                System.out.println("Item ID: " + item.getItemID());
            });
        } else {
            System.out.println("No items in outfit");
        }
        
        try {
            // Fix TransientObjectException by retrieving the actual Dressing entity from database
            if (o.getDressing() != null) {
                // The Dressing entity has a field 'id' but frontend sends 'dressingID'
                Long dressingId = null;
                
                // Try to get the ID using reflection to handle different field names
                try {
                    if (o.getDressing().getId() != null) {
                        dressingId = o.getDressing().getId();
                        System.out.println("Found dressing ID using getId(): " + dressingId);
                    } else if (o.getDressing().getClass().getDeclaredField("dressingID") != null) {
                        java.lang.reflect.Field field = o.getDressing().getClass().getDeclaredField("dressingID");
                        field.setAccessible(true);
                        dressingId = (Long) field.get(o.getDressing());
                        System.out.println("Found dressing ID using reflection: " + dressingId);
                    }
                } catch (Exception e) {
                    System.out.println("Error getting dressing ID: " + e.getMessage());
                }
                
                if (dressingId != null) {
                    Long finalDressingId = dressingId;
                    Dressing existingDressing = dressingRepository.findById(dressingId)
                        .orElseThrow(() -> new RuntimeException("Dressing not found with id: " + finalDressingId));
                    o.setDressing(existingDressing);
                    System.out.println("Successfully set existing dressing with ID: " + existingDressing.getId());
                } else {
                    throw new RuntimeException("Could not find dressing ID in the request");
                }
            }
            
            // Handle attached items - replace with persistent entities
            if (o.getItems() != null && !o.getItems().isEmpty()) {
                List<Item> persistentItems = new ArrayList<>();
                
                for (Item item : o.getItems()) {
                    if (item.getItemID() != null) {
                        Item persistentItem = itemRepository.findById(item.getItemID())
                            .orElseThrow(() -> new RuntimeException("Item not found with id: " + item.getItemID()));
                        persistentItems.add(persistentItem);
                    }
                }
                
                o.setItems(persistentItems);
            }
            
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
