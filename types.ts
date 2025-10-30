
export interface CatalogData {
  title: string;
  detailedDescription: string;
  tags: string[];
  value: string;
}

export interface SavedCatalogItem extends CatalogData {
    image: string;
}