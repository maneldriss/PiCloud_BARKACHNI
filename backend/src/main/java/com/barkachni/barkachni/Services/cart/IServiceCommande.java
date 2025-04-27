package com.barkachni.barkachni.Services.cart;



import com.barkachni.barkachni.entities.cart.commande;

import java.util.List;

public interface IServiceCommande {
    List<commande> retrieveAllcommandes();
    commande retrievecommande(Long commandeId);
    commande addcommande(commande commande);
    void removecommande(Long commandeId);
    commande modifycommande(commande commande);
    commande assignCartToCommande(Long commandeId, Long cartId);
    public double getCommandeTotal(Long commandeId);











    commande placeOrder(Long cartId, String shippingAddress,
                        String shippingMethod, String paymentMethod,
                        Double discountApplied, String discountType,
                        Integer UserId);

    void updatePaymentStatus(Long commandeId, String  status);

    commande getCommandeByUserId(Integer userId);

    commande retrieveCartByUserId(Integer userId);

    commande retrieveCommandeByUserId(Integer userId);

    List<commande> retrieveCommandesByUserId(Integer userId);
}
