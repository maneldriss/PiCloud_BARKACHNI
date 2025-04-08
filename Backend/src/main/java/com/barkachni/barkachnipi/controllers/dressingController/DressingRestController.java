package com.barkachni.barkachnipi.controllers.dressingController;

import com.barkachni.barkachnipi.entities.dressingEntity.Dressing;
import com.barkachni.barkachnipi.services.dressingService.IDressingService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/dressing")
public class DressingRestController {
    IDressingService dressingService;
    @GetMapping("/retrieve-all-dressings")
    public List<Dressing> getDressings() {
        return dressingService.retrieveAllDressings();
    }
    @GetMapping("/retrieve-dressing/{dressing-id}")
    public Dressing retrieveDressing(@PathVariable("dressing-id") Long dId) {
        return dressingService.retrieveDressing(dId);
    }
    @PostMapping("/add-dressing")
    public Dressing addDressing(@RequestBody Dressing d) {
        return dressingService.addDressing(d);
    }
    @DeleteMapping("/remove-dressing/{dressing-id}")
    public void removeDressing(@PathVariable("dressing-id") Long dId) {
        dressingService.removeDressing(dId);
    }
    @PutMapping("/update-dressing")
    public Dressing updateDressing(@RequestBody Dressing d) {
        return dressingService.updateDressing(d);
    }
    @PutMapping("/add-outfit/{dressing-id}/{outfit-id}")
    public Dressing addOutfitToDressing(
            @PathVariable("dressing-id") Long dressingId,
            @PathVariable("outfit-id") Long outfitId) {
        return dressingService.addOutfitToDressing(dressingId, outfitId);
    }

    @PutMapping("/remove-outfit/{dressing-id}/{outfit-id}")
    public Dressing removeOutfitFromDressing(
            @PathVariable("dressing-id") Long dressingId,
            @PathVariable("outfit-id") Long outfitId) {
        return dressingService.removeOutfitFromDressing(dressingId, outfitId);
    }
}
