import { Component } from '@angular/core';

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent {
  messages: { text: string, isUser: boolean }[] = [];
  userInput = '';
  loading = false;
  chatVisible = false;

  // Liste des salutations et mots de politesse
  private readonly greetings = [
    'bonjour', 'bonsoir', 'salut', 'coucou', 'hey', 'hi', 'hello',
    'merci', 'mercii', 'merci beaucoup', 'thank you', 'thanks'
  ];

  toggleChat() {
    this.chatVisible = !this.chatVisible;
  }

  async sendMessage() {
    const message = this.userInput.trim();
    if (!message) return;

    this.messages.push({ text: message, isUser: true });
    this.userInput = '';
    
    // Vérifie si c'est une salutation
    if (this.isGreeting(message)) {
      this.messages.push({ 
        text: "Comment puis-je vous aider aujourd'hui ? \n\n" ,
        isUser: false 
      });
      return;
    }

    this.loading = true;

    try {
      const response = this.getDonationResponse(message.toLowerCase());
      if (response) {
        this.messages.push({ text: response, isUser: false });
      } else {
        this.messages.push({ 
          text: "Je ne comprends pas votre demande. Voici comment je peux vous aider :\n\n" +
                "- Comment faire un don\n" +
                "- Le traitement du don\n" +
                "- Les points des dons\n" +
                "- Les types de dons acceptés", 
          isUser: false 
        });
      }
    } catch (error) {
      console.error('Erreur:', error);
      this.messages.push({ text: '❌ Une erreur est survenue.', isUser: false });
    } finally {
      this.loading = false;
    }
  }

  private isGreeting(message: string): boolean {
    const lowerMessage = message.toLowerCase();
    return this.greetings.some(greeting => 
      lowerMessage === greeting || 
      lowerMessage.startsWith(`${greeting} `) || 
      lowerMessage.includes(` ${greeting}`) ||
      lowerMessage.endsWith(` ${greeting}`)
    );
  }

  private getDonationResponse(message: string): string | null {
    if (message.includes('comment faire un don') || message.includes('faire un don')) {
      return this.donationResponses["comment faire un don"];
    } 
    if (message.includes('traitement du don') || message.includes('traitement dons')) {
      return this.donationResponses["traitement du don"];
    }
    if (message.includes('points') && (message.includes('don') || message.includes('dons'))) {
      return this.donationResponses["points des dons"];
    }
    if (message.includes('types de don') || message.includes('type de dons')) {
      return this.donationResponses["types de dons"];
    }
    return null;
  }

  private donationResponses = {
    "comment faire un don": "Pour faire un don sur Barkachni, voici les étapes :\n\n" +
                        "1. Don d'argent :\n" +
                        "   - Cliquez sur 'Faire un don'\n" +
                        "   - Choisissez le montant\n" +
                        "   - Validez le paiement\n\n" +
                        "2. Don de vêtements :\n" +
                        "   - Sélectionnez 'Don de vêtements'\n" +
                        "   - Ajoutez des photos\n" +
                        "   - Soumettez votre don",
    
    "traitement du don": "Le traitement de votre don suit ces étapes :\n\n" +
                        "1. Réception et vérification initiale\n" +
                        "2. Validation par nos administrateurs\n" +
                        "3. Attribution des points à votre compte\n" +
                        "4. Notification par email\n" +
                        "5. Distribution aux bénéficiaires\n\n" +
                        "Vous pouvez suivre l'état de votre don dans votre espace personnel.",
    
    "points des dons": "Notre système de points fonctionne ainsi :\n\n" +
                        "🎁 Dons d'argent :\n" +
                        "- 1 point par dinar donné\n\n" +
                        "👕 Dons de vêtements :\n" +
                        "- 50 points par article en bon état\n" +
                        "- Bonus de 20 points pour les articles neufs\n\n" +
                        "♻️ Bonus mensuels :\n" +
                        "- +100 points pour 3 dons dans le mois\n" +
                        "- Classement mensuel des donateurs",
    
    "types de dons": "Barkachni accepte deux types de dons :\n\n" +
                        "💰 Dons d'argent :\n" +
                        "- Montant minimum : 1 dinar\n" +
                        "- Paiement sécurisé\n" +
                        "- Reçu fiscal disponible\n\n" +
                        "👔 Dons de vêtements :\n" +
                        "- Vêtements en bon état\n" +
                        "- Accessoires\n" +
                        "- Chaussures\n\n" +
                        "Tous les dons sont vérifiés avant acceptation."
  };
}
/*import { Component } from '@angular/core';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent {
  messages: { text: string, isUser: boolean }[] = [];
  userInput = '';
  loading = false;
  chatVisible = false;
  private genAI = new GoogleGenerativeAI('');

  private model = this.genAI.getGenerativeModel({
    model: 'gemini-1.5-pro-latest', 
    generationConfig: {
      maxOutputTokens: 1000,
      temperature: 0.7,
    }
  });

 

  toggleChat() {
    this.chatVisible = !this.chatVisible;
  }

  async sendMessage() {
    if (!this.userInput.trim()) return;

    const userMessage = this.userInput.toLowerCase();
    this.messages.push({ text: this.userInput, isUser: true });
    this.userInput = '';
    this.loading = true;

    try {
      // Vérifier si la question concerne les dons
      let responseText = '';
      
      if (userMessage.includes('comment faire un don') || userMessage.includes('faire un don')) {
        responseText = this.donationResponses["comment faire un don"];
      } 
      else if (userMessage.includes('traitement du don') || userMessage.includes('traitement dons')) {
        responseText = this.donationResponses["traitement du don"];
      }
      else if (userMessage.includes('points') && (userMessage.includes('don') || userMessage.includes('dons'))) {
        responseText = this.donationResponses["points des dons"];
      }
      else if (userMessage.includes('types de don') || userMessage.includes('type de dons')) {
        responseText = this.donationResponses["types de dons"];
      }

      if (responseText) {
        this.messages.push({ text: responseText, isUser: false });
      } else {
        //  utiliser Gemini
        const result = await this.model.generateContent({
          contents: [{
            role: 'user',
            parts: [{ text: userMessage }]
          }]
        });

        const response = await result.response;
        responseText = response.text();
        this.messages.push({ text: responseText, isUser: false });
      }
    } catch (error) {
      console.error('Erreur complète:', error);
      this.messages.push({ text: '❌ Une erreur est survenue lors de la communication avec Gemini.', isUser: false });
    } finally {
      this.loading = false;
    }
  }
  private donationResponses = {
    "comment faire un don": "Pour faire un don sur Barkachni, voici les étapes :\n\n" +
                        "1. Don d'argent :\n" +
                        "   - Cliquez sur 'Faire un don'\n" +
                        "   - Choisissez le montant\n" +
                        "   - Validez le paiement\n\n" +
                        "2. Don de vêtements :\n" +
                        "   - Sélectionnez 'Don de vêtements'\n" +
                        "   - Ajoutez des photos\n" +
                        "   - Soumettez votre don",
    
    "traitement du don": "Le traitement de votre don suit ces étapes :\n\n" +
                        "1. Réception et vérification initiale\n" +
                        "2. Validation par nos administrateurs\n" +
                        "3. Attribution des points à votre compte\n" +
                        "4. Notification par email\n" +
                        "5. Distribution aux bénéficiaires\n\n" +
                        "Vous pouvez suivre l'état de votre don dans votre espace personnel.",
    
    "points des dons": "Notre système de points fonctionne ainsi :\n\n" +
                        "🎁 Dons d'argent :\n" +
                        "- 1 point par dinar donné\n\n" +
                        "👕 Dons de vêtements :\n" +
                        "- 50 points par article en bon état\n" +
                        "- Bonus de 20 points pour les articles neufs\n\n" +
                        "♻️ Bonus mensuels :\n" +
                        "- +100 points pour 3 dons dans le mois\n" +
                        "- Classement mensuel des donateurs",
    
    "types de dons": "Barkachni accepte deux types de dons :\n\n" +
                        "💰 Dons d'argent :\n" +
                        "- Montant minimum : 1 dinar\n" +
                        "- Paiement sécurisé\n" +
                        "- Reçu fiscal disponible\n\n" +
                        "👔 Dons de vêtements :\n" +
                        "- Vêtements en bon état\n" +
                        "- Accessoires\n" +
                        "- Chaussures\n\n" +
                        "Tous les dons sont vérifiés avant acceptation."
  };
}*/