import { INaturalistTaxa } from "@/types/inaturalist-taxa"
import { uploadTaxaMedia } from "@/lib/aws/s3-utils"
import { getOrCreateSourceInaturalistById } from "@/lib/database/populate/get-or-create-source-inaturalist-by-id"
import prisma from "@/lib/prisma"

export const populateMediaById = async (id: number) => {
  // Get inaturalist data from db
  const taxaData = await prisma.taxa.findFirst({
    select: {
      id: true,
      medias: true,
    },
    where: {
      id: id,
    },
  })

  if (!taxaData) {
    throw new Error(`No taxa found for id ${id}`)
  }

  const source = await getOrCreateSourceInaturalistById(id)

  if (!source) {
    throw new Error(`No inaturalist source found for taxa ${id}`)
  }

  const iNatPhotos = (source.json as INaturalistTaxa).taxon_photos

  let position = 1
  for (const [indexPhoto, valuePhoto] of iNatPhotos.entries()) {
    const MAX_PHOTOS = 10
    if (position > MAX_PHOTOS) break // Upload 10 photos per taxa max

    console.log(`Processing photo ${indexPhoto + 1} / ${MAX_PHOTOS}`)

    const photoUrl = valuePhoto.photo.original_url
    const photoAttribution = valuePhoto.photo.attribution

    // Check if media already exists
    let mediaExists = false
    for (const media of taxaData.medias) {
      if (media.originalUrl === photoUrl) {
        console.log(`Media for ${taxaData.id} already exists, skipping - ${photoUrl}`)
        mediaExists = true
        break
      }
    }
    if (mediaExists) {
      position++
      continue
    }

    // Fetch photo
    const response = await fetch(photoUrl, {
      cache: "no-store",
    })

    if (!response.ok) {
      console.log(`Failed to fetch photo for ${taxaData.id} - ${photoUrl}`)
      continue
    }

    const contentType = response.headers.get("content-type")
    if (!contentType) {
      console.log(`Failed to get content type for ${taxaData.id} - ${photoUrl}`)
      continue
    }

    const blob = await response.blob()
    const publicUrl = await uploadTaxaMedia(taxaData.id.toString(), blob)
    console.log(`${taxaData.id} - Uploaded ${publicUrl}`)

    await prisma.taxaMedia.create({
      data: {
        url: publicUrl,
        originalUrl: photoUrl,
        attribution: photoAttribution,
        taxaId: taxaData.id,
        type: "image",
        position: position,
      },
    })
    position++
  }

  // Refetch the new medias
  const newTaxaData = await prisma.taxa.findFirst({
    select: {
      id: true,
      medias: true,
    },
    where: {
      id: id,
    },
  })

  return newTaxaData
}
