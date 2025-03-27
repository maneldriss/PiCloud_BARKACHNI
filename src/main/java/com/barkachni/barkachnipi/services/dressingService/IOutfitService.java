package com.barkachni.barkachnipi.services.dressingService;

import com.barkachni.barkachnipi.entities.dressingEntity.Outfit;

import java.util.List;

public interface IOutfitService {
    List<Outfit> retrieveAllOutfits();
    Outfit retrieveOutfit(long OutfitId);
    Outfit addOutfit(Outfit i);
    void removeOutfit(long OutfitId);
    Outfit updateOutfit(Outfit i);

    Outfit assignOutfitToDressing(Long outfitId, Long dressingId);
    Outfit removeOutfitFromDressing(Long outfitId);
    Outfit addItemToOutfit(Long outfitId, Long itemId);
    Outfit removeItemFromOutfit(Long outfitId, Long itemId);

}
