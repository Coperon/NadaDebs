//npx sanity@latest exec scripts/deleteAllProducts.ts --with-user-token
import {getCliClient} from 'sanity/cli'

const client = getCliClient()

async function deleteAcademicBodyproducts() {
  try {
    const query = '*[_type == "product"]'
    const products = await client.fetch(query)

    console.log(`Found ${products.length} product documents.`)

    for (const product of products) {
      try {
        await client.delete(product._id)
        console.log(`Deleted: ${product._id}`)
      } catch (error) {
        console.error(`Failed to delete ${product._id}:`, error.message)
      }
    }

    console.log('Deletion completed.')
  } catch (error) {
    console.error('Error fetching product documents:', error.message)
  }
}

deleteAcademicBodyproducts()
