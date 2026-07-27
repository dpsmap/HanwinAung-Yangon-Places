export interface Place {
  place_id: string;
  name: string;
  name_my: string; // Burmese translation
  category: string;
  category_my: string; // Burmese translation
  house_number?: string;
  house_number_my?: string;
  full_address: string;
  full_address_my: string; // Burmese translation
  township?: string;
  township_my?: string;
  district?: string;
  district_my?: string;
  sub_region?: string;
  sub_region_my?: string;
  postal_code?: string;
  lat: number;
  lon: number;
  embed_text?: string;
  phone: string;
  rating: number;
  review_count: number;
  website: string;
  city: 'Yangon';
  tags?: string;
  distanceText?: string;
  name_romanized?: string;
  phone_normalized?: string;

  // Precomputed lowercase & joint fields for blazing-fast search
  _lc_name?: string;
  _lc_name_my?: string;
  _lc_name_romanized?: string;
  _lc_full_address?: string;
  _lc_full_address_my?: string;
  _lc_category?: string;
  _lc_category_my?: string;
  _lc_tags?: string;
  _lc_township?: string;
  _lc_township_my?: string;
  _lc_phone_normalized?: string;
  _lc_phone_raw?: string;
  _joint_name_en?: string;
  _joint_name_my?: string;
  _joint_name_rom?: string;
  _joint_addr_en?: string;
  _joint_addr_my?: string;
  _joint_tags?: string;
  _joint_all_fields_en?: string;
  _joint_all_fields_my?: string;
}

export type Language = 'en' | 'my';

export interface RouteInfo {
  startName: string;
  startCoords: [number, number];
  endName: string;
  endCoords: [number, number];
  distanceKm: number;
  durationMin: number;
  path: [number, number][]; // coordinates along path
}

export interface SearchFilters {
  query: string;
  city: 'all' | 'Yangon';
  category: string;
  minRating: number;
  sortBy: 'rating' | 'reviews' | 'name';
}
