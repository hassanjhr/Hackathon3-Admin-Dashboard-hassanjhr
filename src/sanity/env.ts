export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-02-06'

export const dataset = assertValue(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  'Missing environment variable: NEXT_PUBLIC_SANITY_DATASET'
)

export const projectId = assertValue(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  'Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID'
)

export const token = assertValue(
  "sk3NmMYRBsY5Tisbb7pFTxQKXDpHgw12ebembPx7aL1j0juEQsdvZaPjePCDXXhYgbRuNsh08Ankg4nBoW7wJfdpmXD23AMQ3hkwNhKLBhbw30AVQIPJnWGdf1m13cozPA3965p6csbOxRvY6ezPzrYS7jiDJY1hAo4GQvENT9vKgY2CYUXC",
  'Missing environment variable: NEXT_API_TOKEN'
)

function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage)
  }

  return v
}
