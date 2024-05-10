import { notFound } from "next/navigation"
import { taxonomyRankDict } from "@/constants/taxonomy-rank-dict"
import { AddToListTrigger } from "@/features/list/components/add-to-list-trigger"
import { AttributeEnum, Prisma, Taxa } from "@prisma/client"

import prisma from "@/lib/prisma"
import { capitalizeWords } from "@/lib/utils"
import { Carousel, CarouselContent, CarouselDots, CarouselItem } from "@/components/ui/carousel"
import { Icons } from "@/components/ui/icons"
import ImageLoader from "@/components/ui/image-loader"
import { Flag } from "@/components/flag"
import BackButton from "@/components/species/back-button"
import { HighlightAttributes, HighlightAttributesElement } from "@/components/species/ui/highlight-attributes"
import { Section, SectionContent, SectionTitle } from "@/components/species/ui/section"

export default async function SpeciesPage({ params }: { params: { speciesId: string } }) {
  const species = await prisma.taxa.findUnique({
    include: {
      medias: true,
      ancestors: true,
      attributes: {
        include: {
          attributeDefinition: true,
        },
      },
    },
    where: {
      id: Number(params.speciesId),
    },
  })

  if (!species) notFound()

  let attributesMap: {
    [key in AttributeEnum]?: Prisma.AttributeGetPayload<{ include: { attributeDefinition: true } }>
  } = {}
  species.attributes.forEach((attribute) => {
    attributesMap[attribute.attributeDefinitionId] = attribute
  })

  return (
    <div>
      <div className="relative">
        <BackButton />
        <AddToListTrigger speciesId={Number(params.speciesId)} />
        <Carousel className="aspect-[3/2] overflow-hidden rounded-b-md">
          <CarouselContent>
            {species.medias.length === 0 && (
              <CarouselItem>
                <ImageLoader
                  src={null}
                  width={200}
                  height={200}
                  alt="ads"
                  className="h-full w-full rounded-b-md object-cover"
                />
              </CarouselItem>
            )}
            {species.medias.map((media, i) => (
              <CarouselItem key={i}>
                <ImageLoader
                  src={media?.url}
                  width={200}
                  height={200}
                  alt="ads"
                  className="h-full w-full rounded-b-md object-cover"
                  priority={i === 0}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselDots />
        </Carousel>
      </div>
      {/* Title */}
      <div className="p-3">
        {species.commonNames.en && (
          <h1 className="flex items-center gap-2 text-lg font-semibold">
            <Flag className="flex-none" countryCode="uk" />
            <span className="truncate">{capitalizeWords(species.commonNames.en[0])}</span>
          </h1>
        )}
        {species.commonNames.fr && (
          <h1 className="flex items-center gap-2 text-lg font-semibold">
            <Flag className="flex-none" countryCode="fr" />
            <span className="truncate">{capitalizeWords(species.commonNames.fr[0])}</span>
          </h1>
        )}
        <p className="text-gray-600">{capitalizeWords(species.scientificName)}</p>
      </div>
      <HighlightAttributes className="m-3">
        {attributesMap.max_length?.value && (
          <HighlightAttributesElement>
            <Icons.maxLength className="size-6" />
            <span>
              {"<"} {attributesMap.max_length?.value}
            </span>
          </HighlightAttributesElement>
        )}
        <HighlightAttributesElement>
          <Icons.depth className="size-6" />
          <span>
            {attributesMap.depth_min?.value} - {attributesMap.depth_max?.value}
          </span>
        </HighlightAttributesElement>
        <HighlightAttributesElement>
          <Icons.rarity className="size-6" />
          <span>{attributesMap.rarity?.value}</span>
        </HighlightAttributesElement>
      </HighlightAttributes>
      {/* Attributes */}
      <Section>
        <SectionTitle>Environment</SectionTitle>
        <SectionContent>
          <div className="flex items-center gap-2">
            <Icons.habitat className="size-5" />
            <div className="flex flex-col">
              <div className="font-medium">
                {attributesMap.primary_habitats?.value.map((habitat: string) => capitalizeWords(habitat)).join(", ")}
              </div>
              <div className="text-muted-foreground">
                {attributesMap.secondary_habitats?.value.map((habitat: string) => capitalizeWords(habitat)).join(", ")}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Icons.region className="size-5" />
            <div className="font-medium">
              {attributesMap.regions?.value.map((region: string) => capitalizeWords(region)).join(", ")}
            </div>
          </div>
        </SectionContent>
      </Section>
      <Section>
        <SectionTitle>Lifestyle and behavior</SectionTitle>
        <SectionContent>
          <div className="flex items-center gap-2">
            <Icons.sociability className="size-5" />
            <div className="font-medium">{capitalizeWords(attributesMap.sociability?.value)}</div>
          </div>
        </SectionContent>
      </Section>
      {/* Taxonomy */}
      <Section>
        <SectionTitle>TAXONOMY</SectionTitle>
        {Taxonomy(species.ancestors)}
      </Section>
    </div>
  )
}

const Taxonomy = (ancestors: Taxa[]) => {
  if (ancestors.length === 0) {
    return ""
  }
  const taxa = ancestors[0]
  ancestors.shift()

  return (
    <ul className="list-disc pl-4">
      <li>
        {/* Name */}
        <div className="font-medium">
          {taxa.commonNames.fr ? capitalizeWords(taxa.commonNames.fr[0]) : capitalizeWords(taxa.scientificName)}
        </div>
        {/* Rank */}
        <div className="text-sm text-muted-foreground">{taxonomyRankDict[taxa.rank].en}</div>
      </li>
      {Taxonomy(ancestors)}
    </ul>
  )
}
