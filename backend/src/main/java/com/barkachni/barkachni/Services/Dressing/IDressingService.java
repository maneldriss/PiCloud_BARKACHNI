package com.barkachni.barkachni.Services.Dressing;


import com.barkachni.barkachni.entities.Dressing.Dressing;

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
