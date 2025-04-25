package com.barkachni.barkachni.repositories.Dressing;

import com.barkachni.barkachni.entities.Dressing.Item;
import com.barkachni.barkachni.entities.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.net.Inet4Address;
import java.util.List;

public interface ItemRepository extends JpaRepository<Item, Long> {
    List<Item> findByUserId(Integer userID);
}
