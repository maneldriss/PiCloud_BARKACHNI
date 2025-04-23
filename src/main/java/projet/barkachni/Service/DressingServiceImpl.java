package projet.barkachni.Service;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import projet.barkachni.Entity.Dressing;
import projet.barkachni.Entity.Outfit;
import projet.barkachni.Entity.User;
import projet.barkachni.Repository.DressingRepository;
import projet.barkachni.Repository.OutfitRepository;
import projet.barkachni.Repository.UserRepository;

import java.util.ArrayList;
import java.util.List;

@Service
@AllArgsConstructor
public class DressingServiceImpl implements IDressingService {
    private final DressingRepository dressingRepository;
    private final OutfitRepository outfitRepository;
    private final UserRepository userRepository;

    @Override
    public List<Dressing> retrieveAllDressings() {
        return dressingRepository.findAll();
    }

    @Override
    public Dressing retrieveDressing(long dressingId) {
        return dressingRepository.findById(dressingId)
                .orElseThrow(() -> new RuntimeException("Dressing not found with id: " + dressingId));
    }

    @Override
    public Dressing addDressing(Dressing d) {
        User user = userRepository.findById(1L)
                .orElseThrow(() -> new RuntimeException("User not found with id: 1"));
        d.setUser(user);
        return dressingRepository.save(d);
    }

    @Override
    public Dressing updateDressing(Dressing d) {
        dressingRepository.findById(d.getId())
                .orElseThrow(() -> new RuntimeException("Dressing not found with id: " + d.getId()));
        User user = userRepository.findById(1L)
                .orElseThrow(() -> new RuntimeException("User not found with id: 1"));
        d.setUser(user);
        return dressingRepository.save(d);
    }

    @Override
    public void removeDressing(long dressingId) {
        dressingRepository.deleteById(dressingId);
    }

    @Override
    public Dressing addOutfitToDressing(Long dressingId, Long outfitId) {
        Dressing dressing = retrieveDressing(dressingId);
        Outfit outfit = outfitRepository.findById(outfitId)
                .orElseThrow(() -> new RuntimeException("Outfit not found with id: " + outfitId));

        if (dressing.getOutfits() == null) {
            dressing.setOutfits(new ArrayList<>());
        }

        outfit.setDressing(dressing);
        dressing.getOutfits().add(outfit);
        outfitRepository.save(outfit);
        return dressingRepository.save(dressing);
    }

    @Override
    public Dressing removeOutfitFromDressing(Long dressingId, Long outfitId) {
        Dressing dressing = retrieveDressing(dressingId);
        Outfit outfit = outfitRepository.findById(outfitId)
                .orElseThrow(() -> new RuntimeException("Outfit not found with id: " + outfitId));

        if (dressing.getOutfits() != null) {
            dressing.getOutfits().removeIf(o -> o.getOutfitID().equals(outfitId));
        }

        outfit.setDressing(null);
        outfitRepository.save(outfit);
        return dressingRepository.save(dressing);
    }

}
