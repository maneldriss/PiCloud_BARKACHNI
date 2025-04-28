import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, forkJoin } from 'rxjs';
import { map, catchError, timeout } from 'rxjs/operators';
import {Item} from "../../models/Dressing/item.model";
import {WeatherData} from "./weather.service";
import {Outfit} from "../../models/Dressing/outfit.model";
import {Category} from "../../models/Dressing/category.enum";


interface HfEmbeddingResponse {
  data: number[][];
}

@Injectable({
  providedIn: 'root'
})
export class AIOutfitRecommendationService {
  private readonly HF_INFERENCE_API = 'https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2';
  private readonly HF_API_TOKEN = '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';
  private readonly USE_OFFLINE_MODE = true;

  constructor(private http: HttpClient) {}

  getEmbeddings(texts: string[]): Observable<number[][]> {
    if (!texts.length) {
      return of([]);
    }

    if (this.USE_OFFLINE_MODE) {
      console.log('Using offline embedding generation');
      return of(texts.map((text) => this.generateEmbeddingFromText(text)));
    }

    // Use Hugging Face API
    return this.http.post<HfEmbeddingResponse>(
      this.HF_INFERENCE_API,
      { inputs: texts },
      {
        headers: {
          'Authorization': `Bearer ${this.HF_API_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    ).pipe(
      timeout(5000),
      map(response => response.data),
      catchError(error => {
        console.error('Error getting embeddings from API:', error);
        // Fallback to local implementation
        console.log('Falling back to local embedding generation');
        return of(texts.map((text) => this.generateEmbeddingFromText(text)));
      })
    );
  }


  private generateEmbeddingFromText(text: string): number[] {
    const dimensions = 384; // Match the dimension of the Hugging Face model
    const embedding = Array(dimensions).fill(0);

    // Simple hash function to generate pseudo-embeddings
    const normalizedText = text.toLowerCase();
    const words = normalizedText.split(/\s+/);

    words.forEach((word, i) => {
      // Create a simple hash for each word
      let hash = 0;
      for (let j = 0; j < word.length; j++) {
        hash = ((hash << 5) - hash) + word.charCodeAt(j);
        hash = hash & hash; // Convert to 32bit integer
      }

      // Use the hash to affect multiple dimensions of the embedding
      const seedPosition = Math.abs(hash) % dimensions;
      for (let k = 0; k < 10; k++) { // Affect 10 positions
        const position = (seedPosition + k) % dimensions;
        embedding[position] += Math.sin(hash * (k + 1)) * 0.1;
      }
    });

    // Normalize the embedding vector
    const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
    return embedding.map(val => magnitude > 0 ? val / magnitude : 0);
  }


  private cosineSimilarity(vecA: number[], vecB: number[]): number {
    if (vecA.length !== vecB.length) {
      console.error('Vector dimensions do not match');
      return 0;
    }

    const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
    const magA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
    const magB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));

    if (magA === 0 || magB === 0) return 0;
    return dotProduct / (magA * magB);
  }

  private getItemDescription(item: Item): string {
    return `${item.itemName} ${item.description || ''}. Category: ${item.category}. Color: ${item.color}. Brand: ${item.brand}. Size: ${item.size}.`;
  }


  private getWeatherPrompt(weather: WeatherData, season: string): string {
    return `Weather: ${weather.temperature}°C, ${weather.conditions}, ${weather.description}. Season: ${season}.`;
  }

  findBestOutfitForWeather(outfits: Outfit[], weather: WeatherData, season: string): Observable<Outfit | null> {
    if (!outfits.length || !weather) {
      return of(null);
    }

    const weatherPrompt = this.getWeatherPrompt(weather, season);

    // Calculate scores using simple text matching as a fallback method
    const simpleScores = outfits.map(outfit => {
      // Basic keyword matching for weather and season
      let score = 0;

      // Check if the outfit's season matches the current season
      if (outfit.season && outfit.season.toLowerCase() === season.toLowerCase()) {
        score += 5; // Strong match for correct season
      }

      // Check if the outfit's occasion matches the weather conditions
      if (outfit.occasion && weather.conditions) {
        if (outfit.occasion.toLowerCase().includes(weather.conditions.toLowerCase()) ||
          weather.conditions.toLowerCase().includes(outfit.occasion.toLowerCase())) {
          score += 3; // Good match for weather condition
        }
      }

      // Add points for having multiple items (more complete outfit)
      if (outfit.items && outfit.items.length > 0) {
        score += Math.min(outfit.items.length / 2, 2); // Up to 2 points for items
      }

      // Extra points for having a specific description
      if (outfit.description && outfit.description.length > 0) {
        score += 1;
      }

      return { outfit, score };
    });

    // Sort by simple scores as backup
    simpleScores.sort((a, b) => b.score - a.score);

    // Prepare outfit descriptions for AI embedding
    const outfitDescriptions = outfits.map(outfit => {
      const itemDescriptions = outfit.items?.map(item => this.getItemDescription(item)).join(' ') || '';
      return `Outfit: ${outfit.outfitName}. ${outfit.description || ''}. Season: ${outfit.season || ''}. Occasion: ${outfit.occasion || ''}. Items: ${itemDescriptions}`;
    });

    // Add weather prompt as the first item
    const allTexts = [weatherPrompt, ...outfitDescriptions];

    // Use embeddings for more sophisticated matching
    return this.getEmbeddings(allTexts).pipe(
      map(embeddings => {
        if (!embeddings.length) {
          console.log('No embeddings returned, falling back to simple score');
          return simpleScores[0]?.outfit || null;
        }

        // The first embedding is for the weather
        const weatherEmbedding = embeddings[0];

        // Calculate similarity scores for each outfit
        const scores = outfits.map((outfit, i) => {
          // The outfit embeddings start at index 1
          const similarity = this.cosineSimilarity(weatherEmbedding, embeddings[i + 1]);
          return { outfit, similarity };
        });

        // Sort by similarity (highest first)
        scores.sort((a, b) => b.similarity - a.similarity);

        console.log('AI Recommendation Scores:', scores.map(s =>
          ({ name: s.outfit.outfitName, score: s.similarity.toFixed(3) })));

        // Return the most similar outfit
        return scores.length > 0 ? scores[0].outfit : null;
      }),
      catchError(error => {
        console.error('Error in AI recommendation:', error);
        // Fallback to simple scoring method
        console.log('Falling back to simple scoring method');
        return of(simpleScores[0]?.outfit || null);
      })
    );
  }


  findComplementaryItems(existingItems: Item[], allItems: Item[]): Observable<Item[]> {
    if (!existingItems.length || !allItems.length) {
      return of([]);
    }

    const existingCategories = new Set(existingItems.map(item => item.category));
    const complementaryItems: Item[] = [];

    const complementaryPairs: Record<string, string[]> = {
      'TOPS': ['PANTS', 'SKIRTS', 'ACCESSORIES'],
      'SHIRTS': ['PANTS', 'SKIRTS', 'ACCESSORIES'],
      'PANTS': ['TOPS', 'SHIRTS', 'SHOES'],
      'SHOES': ['PANTS', 'DRESSES'],
      'DRESSES': ['SHOES', 'ACCESSORIES', 'JEWELRY'],
      'ACCESSORIES': ['TOPS', 'SHIRTS', 'DRESSES'],
      'OUTERWEAR': ['TOPS', 'SHIRTS', 'PANTS', 'DRESSES'],
      'JEWELRY': ['DRESSES', 'TOPS']
    };

    existingItems.forEach(existingItem => {
      const complementaryCategories = complementaryPairs[existingItem.category] || [];
      complementaryCategories.forEach(category => {
        if (!existingCategories.has(<Category>category)) {
          // Find matching items by color or style
          const matchingItems = allItems.filter(item =>
            item.category === category &&
            !existingItems.some(e => e.itemID === item.itemID) &&
            !complementaryItems.some(c => c.itemID === item.itemID)
          );

          // Sort by color similarity (simplified)
          const matchingItemsWithScore = matchingItems.map(item => {
            let score = 0;
            // Matching color is good
            if (item.color === existingItem.color) {
              score += 1;
            }
            // Matching brand might have coordinated style
            if (item.brand === existingItem.brand) {
              score += 0.5;
            }
            return { item, score };
          });

          // Sort by score and take top item
          matchingItemsWithScore.sort((a, b) => b.score - a.score);
          if (matchingItemsWithScore.length > 0) {
            complementaryItems.push(matchingItemsWithScore[0].item);
          }
        }
      });
    });

    // Ensure we don't exceed 3 items and we don't include duplicates
    const uniqueComplementaryItems = complementaryItems
      .filter((item, index, self) =>
        self.findIndex(i => i.itemID === item.itemID) === index
      )
      .slice(0, 3);

    // Use the AI embedding approach as well
    if (this.USE_OFFLINE_MODE) {
      console.log('Using offline complementary item matching');
      return of(uniqueComplementaryItems);
    }

    // Get descriptions for all items
    const existingItemDescriptions = existingItems.map(item => this.getItemDescription(item));
    const allItemDescriptions = allItems.map(item => this.getItemDescription(item));

    // Get embeddings for all items
    return forkJoin([
      this.getEmbeddings(existingItemDescriptions),
      this.getEmbeddings(allItemDescriptions)
    ]).pipe(
      map(([existingEmbeddings, allEmbeddings]) => {
        // Calculate average embedding for existing items
        const averageExistingEmbedding = this.calculateAverageEmbedding(existingEmbeddings);

        // Score all items by similarity to the average existing item embedding
        const itemScores = allItems.map((item, i) => {
          // Skip items that are already in the outfit
          if (existingItems.some(existingItem => existingItem.itemID === item.itemID)) {
            return { item, score: -1 };
          }

          const similarity = this.cosineSimilarity(averageExistingEmbedding, allEmbeddings[i]);
          return { item, score: similarity };
        });

        // Filter out items already in the outfit and sort by similarity
        const candidates = itemScores
          .filter(itemScore => itemScore.score >= 0)
          .sort((a, b) => b.score - a.score);

        // Return top 3 complementary items
        return candidates.slice(0, 3).map(candidate => candidate.item);
      }),
      catchError(error => {
        console.error('Error finding complementary items:', error);
        return of(uniqueComplementaryItems);
      })
    );
  }

  private calculateAverageEmbedding(embeddings: number[][]): number[] {
    if (!embeddings.length) {
      return [];
    }

    const dimensions = embeddings[0].length;
    const average = Array(dimensions).fill(0);

    for (const embedding of embeddings) {
      for (let i = 0; i < dimensions; i++) {
        average[i] += embedding[i];
      }
    }

    for (let i = 0; i < dimensions; i++) {
      average[i] /= embeddings.length;
    }

    return average;
  }
}
