package com.barkachni.barkachni.controllers.Dressing;

import com.barkachni.barkachni.Services.Dressing.IOutfitService;
import com.barkachni.barkachni.entities.Dressing.Outfit;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/outfit")
public class OutfitRestController {
    IOutfitService outfitService;
    @GetMapping("/retrieve-all-outfits")
    public List<Outfit> getItems() {
        return outfitService.retrieveAllOutfits();
    }
    @GetMapping("/retrieve-outfit/{outfit-id}")
    public Outfit retrieveOutfit(@PathVariable("outfit-id") Long oId) {
        return outfitService.retrieveOutfit(oId);
    }

    @PostMapping("/add-outfit")
    public Outfit addOutfit(@RequestBody Outfit o) {
        return outfitService.addOutfit(o);
    }

    @DeleteMapping("/remove-outfit/{outfit-id}")
    public void removeOutfit(@PathVariable("outfit-id") Long oId) {
        outfitService.removeOutfit(oId);
    }
    @PutMapping("/update-outfit")
    public Outfit updateOutfit(@RequestBody Outfit o) {
        return outfitService.updateOutfit(o);
    }
    @PutMapping("/assign-to-dressing/{outfit-id}/{dressing-id}")
    public Outfit assignOutfitToDressing(
            @PathVariable("outfit-id") Long outfitId,
            @PathVariable("dressing-id") Long dressingId) {
        return outfitService.assignOutfitToDressing(outfitId, dressingId);
    }

    @PutMapping("/remove-from-dressing/{outfit-id}")
    public Outfit removeOutfitFromDressing(@PathVariable("outfit-id") Long outfitId) {
        return outfitService.removeOutfitFromDressing(outfitId);
    }

    @PutMapping("/add-item/{outfit-id}/{item-id}")
    public Outfit addItemToOutfit(
            @PathVariable("outfit-id") Long outfitId,
            @PathVariable("item-id") Long itemId) {
        return outfitService.addItemToOutfit(outfitId, itemId);
    }

    @PutMapping("/remove-item/{outfit-id}/{item-id}")
    public Outfit removeItemFromOutfit(
            @PathVariable("outfit-id") Long outfitId,
            @PathVariable("item-id") Long itemId) {
        return outfitService.removeItemFromOutfit(outfitId, itemId);
    }
    @GetMapping("/retrieve-outfits-by-user/{user-id}")
    public List<Outfit> getOutfitsByUserId(@PathVariable("user-id") Integer userID) {
        return outfitService.retrieveOutfitsByUserId(userID);
    }
}
