import { useQuery, useMutation } from "@tanstack/react-query";
import type { Alien, ClusterResult, ProjectionPoint, SimilarityResult } from "@/types/alien";
import { mockAliens, getAlienById } from "@/data/mockAliens";

const API_BASE = import.meta.env.VITE_API_BASE;

// Helper to check if API is available, otherwise use mock data
const fetchWithFallback = async <T>(
  url: string,
  options?: RequestInit,
  fallback?: () => T
): Promise<T> => {
  // console.log(`[API] Attempting to fetch: ${url}`);
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });
    
    if (!response.ok) {
      console.error(`❌ [API] Request failed with status: ${response.status}`);
      throw new Error(`API Error: ${response.status}`);
    }
    
    const data = await response.json();
    // console.log(`✅ [API] Success! Data received from: ${url}`, data);
    return data;
  } catch (error) {
    console.warn(`⚠️ [API] Failed to fetch from: ${url}`, error);
    
    if (fallback) {
      // console.log(`📦 [MOCK] Using mock data as fallback`);
      const mockData = fallback();
      // console.log(`📦 [MOCK] Mock data:`, mockData);
      return mockData;
    }
    
    throw error;
  }
};

// API response type for aliens
interface AlienApiResponse {
  id: string;
  name: string;
  original_name: string;
  image_url: string;
  strength: number;
  speed: number;
  intelligence: number;
  durability: number;
  power: number;
  combat: number;
}

// Transform API alien to our Alien type
const mapApiAlienToAlien = (apiAlien: AlienApiResponse): Alien => ({
  id: apiAlien.id,
  name: apiAlien.name,
  image: apiAlien.image_url,
  species: apiAlien.original_name,
  strength: apiAlien.strength,
  speed: apiAlien.speed,
  intelligence: apiAlien.intelligence,
  durability: apiAlien.durability,
  power: apiAlien.power,
  combat: apiAlien.combat,
});

// Fetch all aliens
export const useAliens = () => {
  return useQuery({
    queryKey: ["aliens"],
    queryFn: async () => {
      try {
        const response = await fetch(`${API_BASE}/aliens`, {
          headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) throw new Error(`API Error: ${response.status}`);
        const data: AlienApiResponse[] = await response.json();
        return data.map(mapApiAlienToAlien);
      } catch (error) {
        console.warn(`⚠️ [API] Failed to fetch aliens, using mock`, error);
        return mockAliens;
      }
    },
    staleTime: 5 * 60 * 1000,
  });
};

// Fetch single alien
export const useAlien = (id: string) => {
  return useQuery({
    queryKey: ["alien", id],
    queryFn: async () => {
      try {
        const response = await fetch(`${API_BASE}/aliens/${id}`, {
          headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) throw new Error(`API Error: ${response.status}`);
        const data: AlienApiResponse = await response.json();
        return mapApiAlienToAlien(data);
      } catch (error) {
        console.warn(`⚠️ [API] Failed to fetch alien, using mock`, error);
        const alien = getAlienById(id);
        if (!alien) throw new Error("Alien not found");
        return alien;
      }
    },
    enabled: !!id,
  });
};

// API response types for similarity
interface SimilarityApiStats {
  strength: number;
  speed: number;
  intelligence: number;
  durability: number;
  power: number;
  combat: number;
}

interface SimilarityApiItem {
  id: string;
  display_name: string;
  original_name: string;
  image_url: string;
  score: number;
  stats: SimilarityApiStats;
}

interface SimilarityApiResponse {
  query: string;
  metric: string;
  similar: SimilarityApiItem[];
  opposite: SimilarityApiItem;
}

// Transform API item to our Alien type
const mapApiItemToAlien = (item: SimilarityApiItem): Alien => ({
  id: item.id,
  name: item.display_name,
  image: item.image_url || "",
  species: item.original_name,
  strength: item.stats.strength,
  speed: item.stats.speed,
  intelligence: item.stats.intelligence,
  durability: item.stats.durability,
  power: item.stats.power,
  combat: item.stats.combat,
});

export interface SimilarityData {
  similar: SimilarityResult[];
  opposite: SimilarityResult | null;
}

// Similarity search
export const useSimilarity = (alienId: string, metric: string = "cosine") => {
  return useQuery({
    queryKey: ["similarity", alienId, metric],
    queryFn: async (): Promise<SimilarityData> => {
      // console.log(`🔄 [API] Fetching similarity for: ${alienId} with metric: ${metric}`);
      
      try {
        const response = await fetch(`${API_BASE}/similarity/?alien_id=${alienId}&metric=${metric}&top_k=3`, {
          headers: { "Content-Type": "application/json" },
        });
        
        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`);
        }
        
        const data: SimilarityApiResponse = await response.json();
        // console.log(`✅ [API] Similarity data received:`, data);
        
        // Transform API response to our format
        const similar: SimilarityResult[] = data.similar.map((item) => ({
          alien: mapApiItemToAlien(item),
          similarity: item.score,
        }));
        
        const opposite: SimilarityResult | null = data.opposite ? {
          alien: mapApiItemToAlien(data.opposite),
          similarity: data.opposite.score,
        } : null;
        
        return { similar, opposite };
      } catch (error) {
        console.warn(`⚠️ [API] Similarity fetch failed, using mock`, error);
        
        // Mock fallback
        const sourceAlien = getAlienById(alienId);
        if (!sourceAlien) return { similar: [], opposite: null };
        
        const results = mockAliens
          .filter((a) => a.id !== alienId)
          .map((alien) => {
            const features = ["strength", "speed", "intelligence", "durability"] as const;
            const distance = Math.sqrt(
              features.reduce((sum, f) => {
                const diff = (sourceAlien[f] ?? 0) - (alien[f] ?? 0);
                return sum + diff * diff;
              }, 0)
            );
            const similarity = Math.max(0, 1 - distance / 200);
            return { alien, similarity };
          })
          .sort((a, b) => b.similarity - a.similarity);
        
        return {
          similar: results.slice(0, 3),
          opposite: results[results.length - 1] || null,
        };
      }
    },
    enabled: !!alienId,
  });
};

// Clustering
interface ClusterParams {
  algorithm: "kmeans" | "hierarchical";
  k: number;
  features: string[];
}

export const useCluster = () => {
  return useMutation({
    mutationFn: (params: ClusterParams) =>
      fetchWithFallback<ClusterResult[]>(
        `${API_BASE}/cluster`,
        {
          method: "POST",
          body: JSON.stringify(params),
        },
        () => {
          // Mock clustering
          const { k } = params;
          const clusters: ClusterResult[] = [];
          
          for (let i = 0; i < k; i++) {
            clusters.push({ cluster: i, aliens: [] });
          }
          
          mockAliens.forEach((alien, index) => {
            const clusterIndex = index % k;
            clusters[clusterIndex].aliens.push(alien);
          });
          
          return clusters;
        }
      ),
  });
};

// Dimensionality reduction - API response type
interface ProjectionApiResponse {
  method: string;
  features: string[];
  points: ProjectionPoint[];
}

interface ReduceParams {
  method: "pca" | "umap";
  features: string[];
}

export const useReduce = () => {
  return useMutation({
    mutationFn: async (params: ReduceParams): Promise<ProjectionPoint[]> => {
      const featuresParam = params.features.join(",");
      const url = `${API_BASE}/projection/2d?features=${encodeURIComponent(featuresParam)}`;
      
      // console.log(`🔄 [API] Fetching 2D projection: ${url}`);
      
      try {
        const response = await fetch(url, {
          headers: { "Accept": "application/json" },
        });
        
        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`);
        }
        
        const data: ProjectionApiResponse = await response.json();
        // console.log(`✅ [API] Projection data received:`, data);
        
        return data.points;
      } catch (error) {
        console.warn(`⚠️ [API] Projection fetch failed, using mock`, error);
        
        // Mock 2D projection with some variation
        return mockAliens.map((alien, index) => ({
          id: alien.id,
          display_name: alien.name,
          x: Math.cos((index / mockAliens.length) * Math.PI * 2) * 80 + Math.random() * 20 - 10,
          y: Math.sin((index / mockAliens.length) * Math.PI * 2) * 80 + Math.random() * 20 - 10,
          cluster: index % 3,
        }));
      }
    },
  });
};
