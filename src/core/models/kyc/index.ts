export interface KYCForm {
  full_name: string
  id_number: string
  nationality: string
  id_image_front?: string
  id_image_back?: string
  id_image_other?: string
  selfie_with_id?: string
  birthdate: string
  notes: string
}

export interface KYC_Res {
  count: number
  page: number
  total_pages: number
  data: KYC[]
  search: string | null
}

export interface KYC {
  id: number
  full_name: string
  id_number: string
  nationality: string
  id_image_front: string
  id_image_back: string
  selfie_with_id: string
  id_image_other?: string
  //thumbs
  id_image_front_thumbnail: string
  id_image_back_thumbnail: string
  selfie_with_id_thumbnail: string
  id_image_other_thumbnail?: string
  birthdate: string
  notes: string
  user_id: number
  status: "PENDING" | "DECLINED" | "APPROVED"
}
