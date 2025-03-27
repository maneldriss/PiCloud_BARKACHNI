package com.barkachni.barkachnipi.services.dressingService;

import com.barkachni.barkachnipi.entities.dressingEntity.Dressing;
import com.barkachni.barkachnipi.entities.dressingEntity.ItemDressing;
import com.barkachni.barkachnipi.entities.dressingEntity.Outfit;
import com.barkachni.barkachnipi.repositories.dressingRepository.DressingRepository;
import com.barkachni.barkachnipi.repositories.dressingRepository.ItemDressingRepository;
import com.barkachni.barkachnipi.repositories.dressingRepository.OutfitRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@AllArgsConstructor
public class OutfitService implements IOutfitService {
     OutfitRepository outfitRepository;
    DressingRepository dressingRepository;
   ItemDressingRepository itemRepository;

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
        return outfitRepository.save(o);
    }

    @Override
    public Outfit updateOutfit(Outfit o) {
        outfitRepository.findById(o.getOutfitID())
                .orElseThrow(() -> new RuntimeException("Outfit not found with id: " + o.getOutfitID()));
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
        ItemDressing itemDressing = itemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item not found with id: " + itemId));

        if (outfit.getItemDressings() == null) {
            outfit.setItemDressings(new ArrayList<>());
        }

        if (!outfit.getItemDressings().contains(itemDressing)) {
            outfit.getItemDressings().add(itemDressing);
        }

        return outfitRepository.save(outfit);
    }

    @Override
    public Outfit removeItemFromOutfit(Long outfitId, Long itemId) {
        Outfit outfit = retrieveOutfit(outfitId);

        if (outfit.getItemDressings() != null) {
            outfit.getItemDressings().removeIf(i -> i.getItemID().equals(itemId));
        }

        return outfitRepository.save(outfit);
    }
}
