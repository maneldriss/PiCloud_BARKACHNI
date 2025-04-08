package com.barkachni.barkachnipi.services.dressingService;

import com.barkachni.barkachnipi.entities.dressingEntity.Dressing;

import java.util.List;

public interface IDressingService {
    List<Dressing> retrieveAllDressings();
    Dressing retrieveDressing(long dressingId);
    Dressing addDressing(Dressing d);
    void removeDressing(long dressingId);
    Dressing updateDressing(Dressing d);

    Dressing addOutfitToDressing(Long dressingId, Long outfitId);
    Dressing removeOutfitFromDressing(Long dressingId, Long outfitId);

}
