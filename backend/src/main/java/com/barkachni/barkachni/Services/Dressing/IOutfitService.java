package com.barkachni.barkachni.Services.Dressing;

import com.barkachni.barkachni.entities.Dressing.Outfit;
import com.barkachni.barkachni.entities.user.User;

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

    List<Outfit> retrieveOutfitsByUserId(Integer userId);
}
