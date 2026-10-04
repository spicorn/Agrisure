export interface Place {
  name: string
  province: string
}

export const PLACES: Place[] = [
  { name: 'Harare', province: 'Harare' },
  { name: 'Murehwa', province: 'Mashonaland East' },
  { name: 'Marondera', province: 'Mashonaland East' },
  { name: 'Mutare', province: 'Manicaland' },
  { name: 'Gweru', province: 'Midlands' },
  { name: 'Masvingo', province: 'Masvingo' },
  { name: 'Bulawayo', province: 'Bulawayo' },
  { name: 'Chinhoyi', province: 'Mashonaland West' },
]

export interface MapMarker {
  province: string
  label: string
  hint: string
  x: number
  y: number
}

export const MAP_MARKERS: MapMarker[] = [
  { province: 'Harare', label: 'Harare', hint: 'Harare', x: 58, y: 36 },
  { province: 'Mashonaland East', label: 'Mashonaland East', hint: 'Murehwa', x: 70, y: 40 },
  { province: 'Manicaland', label: 'Manicaland', hint: 'Mutare', x: 82, y: 52 },
  { province: 'Midlands', label: 'Midlands', hint: 'Gweru', x: 46, y: 56 },
  { province: 'Masvingo', label: 'Masvingo', hint: 'Masvingo', x: 58, y: 72 },
  { province: 'Bulawayo', label: 'Bulawayo', hint: 'Bulawayo', x: 30, y: 66 },
  { province: 'Mashonaland West', label: 'Mashonaland West', hint: 'Chinhoyi', x: 38, y: 30 },
]

export const PROVINCES = MAP_MARKERS.map((marker) => marker.province)

export function provinceOf(place: string) {
  const hit = PLACES.find((item) => place.toLowerCase().includes(item.name.toLowerCase()))
  return hit?.province ?? 'Harare'
}
