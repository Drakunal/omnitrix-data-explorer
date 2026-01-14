import { useQuery, useMutation } from "@tanstack/react-query";
import type { Alien, ClusterResult, ProjectionPoint, SimilarityResult } from "@/types/alien";
import { mockAliens, getAlienById } from "@/data/mockAliens";

const API_BASE = "http://localhost:8000";

// Helper to check if API is available, otherwise use mock data
const fetchWithFallback = async <T>(
  url: string,
  options?: RequestInit,
  fallback?: () => T
): Promise<T> => {
  console.log(`🔄 [API] Attempting to fetch: ${url}`);
  
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
    console.log(`✅ [API] Success! Data received from: ${url}`, data);
    return data;
  } catch (error) {
    console.warn(`⚠️ [API] Failed to fetch from: ${url}`, error);
    
    if (fallback) {
      console.log(`📦 [MOCK] Using mock data as fallback`);
      const mockData = fallback();
      console.log(`📦 [MOCK] Mock data:`, mockData);
      return mockData;
    }
    
    throw error;
  }
};

// Fetch all aliens
export const useAliens = () => {
  return useQuery({
    queryKey: ["aliens"],
    queryFn: () =>
      fetchWithFallback<Alien[]>(`${API_BASE}/aliens`, undefined, () => mockAliens),
    staleTime: 5 * 60 * 1000,
  });
};

// Fetch single alien
export const useAlien = (id: string) => {
  return useQuery({
    queryKey: ["alien", id],
    queryFn: () =>
      fetchWithFallback<Alien>(`${API_BASE}/aliens/${id}`, undefined, () => {
        const alien = getAlienById(id);
        if (!alien) throw new Error("Alien not found");
        return alien;
      }),
    enabled: !!id,
  });
};

// Similarity search
export const useSimilarity = (alienId: string, metric: string = "cosine") => {
  return useQuery({
    queryKey: ["similarity", alienId, metric],
    queryFn: () =>
      fetchWithFallback<SimilarityResult[]>(
        `${API_BASE}/similarity/${alienId}?metric=${metric}`,
        undefined,
        () => {
          // Mock similarity calculation
          const sourceAlien = getAlienById(alienId);
          if (!sourceAlien) return [];
          
          return mockAliens
            .filter((a) => a.id !== alienId)
            .map((alien) => {
              // Simple Euclidean distance based similarity
              const features = ["strength", "speed", "intelligence", "durability"] as const;
              const distance = Math.sqrt(
                features.reduce((sum, f) => {
                  const diff = (sourceAlien[f] ?? 0) - (alien[f] ?? 0);
                  return sum + diff * diff;
                }, 0)
              );
              // Convert distance to similarity (0-1)
              const similarity = Math.max(0, 1 - distance / 200);
              return { alien, similarity };
            })
            .sort((a, b) => b.similarity - a.similarity);
        }
      ),
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

// Dimensionality reduction
interface ReduceParams {
  method: "pca" | "umap";
  features: string[];
}

export const useReduce = () => {
  return useMutation({
    mutationFn: (params: ReduceParams) =>
      fetchWithFallback<ProjectionPoint[]>(
        `${API_BASE}/reduce`,
        {
          method: "POST",
          body: JSON.stringify(params),
        },
        () => {
          // Mock 2D projection with some variation
          return mockAliens.map((alien, index) => ({
            id: alien.id,
            name: alien.name,
            x: Math.cos((index / mockAliens.length) * Math.PI * 2) * 0.8 + Math.random() * 0.2 - 0.1,
            y: Math.sin((index / mockAliens.length) * Math.PI * 2) * 0.8 + Math.random() * 0.2 - 0.1,
            cluster: index % 3,
          }));
        }
      ),
  });
};
