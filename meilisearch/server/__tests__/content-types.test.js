const createContentTypeService = require('../services/content-types')

const { createFakeStrapi } = require('./utils/fakes')

const fakeStrapi = createFakeStrapi({})
global.strapi = fakeStrapi

describe('Tests content types', () => {
  beforeEach(async () => {
    jest.clearAllMocks()
    jest.restoreAllMocks()
  })

  test('Test get all collection types', async () => {
    const contentTypeServices = createContentTypeService({ strapi: fakeStrapi })
    const collectionTypes = contentTypeServices.getContentTypesName()

    expect(collectionTypes.sort()).toEqual(
      [
        'about',
        'movie',
        'restaurant',
        'file',
        'locale',
        'role',
        'user',
        'permission',
      ].sort()
    )
  })

  test('Test all api names of an empty content type', async () => {
    const customStrapi = createFakeStrapi({ contentTypes: [] })
    const contentTypeServices = createContentTypeService({
      strapi: customStrapi,
    })

    const apiNames = contentTypeServices.getContentTypes()

    expect(apiNames).toEqual([])
  })

  test('Test all content types', async () => {
    const contentTypeServices = createContentTypeService({ strapi: fakeStrapi })
    const contentTypes = contentTypeServices.getContentTypes()

    expect(Object.keys(contentTypes).sort()).toEqual(
      [
        'api::about.about',
        'api::movie.movie',
        'api::restaurant.restaurant',
        'plugin::upload.file',
        'plugin::i18n.locale',
        'plugin::users-permissions.permission',
        'plugin::users-permissions.role',
        'plugin::users-permissions.user',
      ].sort()
    )
  })

  test('Test names of empty content types', async () => {
    const customStrapi = createFakeStrapi({ contentTypes: [] })
    const contentTypeServices = createContentTypeService({
      strapi: customStrapi,
    })

    const contentTypes = contentTypeServices.getContentTypesName()

    expect(contentTypes).toEqual([])
  })

  test('Test empty content types', async () => {
    const customStrapi = createFakeStrapi({ contentTypes: [] })
    const contentTypeServices = createContentTypeService({
      strapi: customStrapi,
    })

    const contentTypes = contentTypeServices.getContentTypesName()

    expect(Object.keys(contentTypes)).toEqual([])
  })

  test('Test if content type exists', async () => {
    const contentTypeServices = createContentTypeService({
      strapi: fakeStrapi,
    })

    const exists = contentTypeServices.getContentTypeUid({
      contentType: 'api::restaurant.restaurant',
    })

    expect(exists).toEqual('api::restaurant.restaurant')
  })

  test('Test number of entries', async () => {
    const contentTypeServices = createContentTypeService({
      strapi: fakeStrapi,
    })

    const count = await contentTypeServices.numberOfEntries({
      contentType: 'api::restaurant.restaurant',
    })

    expect(count).toEqual(1)
  })

  test('Test total number of entries', async () => {
    const contentTypeServices = createContentTypeService({
      strapi: fakeStrapi,
    })

    const count = await contentTypeServices.totalNumberOfEntries({
      contentTypes: [
        'api::restaurant.restaurant',
        'api::movie.movie',
        'not existent',
      ],
    })

    expect(count).toEqual(2)
  })

  test('Test fetching entries of content type', async () => {
    const contentTypeServices = createContentTypeService({
      strapi: fakeStrapi,
    })

    const count = await contentTypeServices.getContentTypeEntries({
      contentType: 'api::restaurant.restaurant',
    })

    expect(count).toEqual([{ id: 1 }])
  })

  test('Test fetching entries on non existing content type', async () => {
    const contentTypeServices = createContentTypeService({
      strapi: fakeStrapi,
    })

    const count = await contentTypeServices.getContentTypeEntries({
      contentType: 'api::test.test',
    })

    expect(count).toEqual([])
  })

  test('Test operation in batches on entries', async () => {
    const contentTypeServices = createContentTypeService({
      strapi: fakeStrapi,
    })

    const contentType = 'api::restaurant.restaurant'
    const entries = await contentTypeServices.actionInBatches({
      collection: contentType,
      callback: ({ entries, contentType }) =>
        entries.map(entry => ({
          id: entry.id + 1,
          contentType,
        })),
    })

    expect(entries[0].id).toEqual(2)
    expect(entries[0].contentType).toEqual(contentType)
  })

  test('Test operation in batches on entries with callback returning nothing', async () => {
    const contentTypeServices = createContentTypeService({
      strapi: fakeStrapi,
    })

    const contentType = 'api::restaurant.restaurant'
    const entries = await contentTypeServices.actionInBatches({
      collection: contentType,
      callback: () => {},
    })

    expect(entries).toEqual([])
  })
})