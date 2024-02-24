import { $, fetch } from 'zx'

async function curlDownload(path: string) {
  await $`curl -L ${path} -o jq`
  await $`chmod +x ./jq`
  await $`./jq --version`
}

interface Recipe {
  name: string
  rating: string
}

export async function run(): Promise<void> {
  await $`echo Hello World!`

  // wget the jq cli
  await curlDownload(
    'https://github.com/jqlang/jq/releases/download/jq-1.7.1/jq-macos-arm64'
  )

  // call a fake api using fetch
  let { recipes } = (await (
    await fetch('https://dummyjson.com/recipes')
  ).json()) as { recipes: Recipe[] }

  recipes = recipes.map(({ name, rating }) => ({
    name,
    rating
  }))

  // get all title using jq
  const out =
    await $`echo ${JSON.stringify(recipes[0])} | ./jq '{name: .name, rating: .rating}'`

  console.log(out)

  // every 2 second give me a dish with its rating (colored)

  // clean up  -- delete the jq cli
  await $`rm ./jq`
}
