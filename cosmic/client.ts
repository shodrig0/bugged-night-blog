import { createBucketClient } from "@cosmicjs/sdk"

const bucketSlug = import.meta.env.VITE_COSMIC_BUCKET_SLUG
const readKey = import.meta.env.VITE_COSMIC_READ_KEY
const writeKey = import.meta.env.VITE_COSMIC_WRITE_KEY

if (!bucketSlug)
  console.error(
    "AAAAA BASTA"
  )
// Make sure to add/update your ENV variables
export const cosmic = createBucketClient({
  bucketSlug: bucketSlug || "You need to add your COSMIC_BUCKET_SLUG environment variable.",
  readKey: readKey || "You need to add your COSMIC_READ_KEY environment variable.",
  writeKey: writeKey || "You need to add your COSMIC_WRITE_KEY environment variable.",
})
