import {orderableDocumentListDeskItem} from '@sanity/orderable-document-list'

// icons: https://react-icons.github.io/react-icons/search/
import {HomeIcon} from '@sanity/icons'
import {DocumentIcon} from '@sanity/icons'
import {FolderIcon} from '@sanity/icons'
import {CogIcon} from '@sanity/icons'
import {EarthAmericasIcon} from '@sanity/icons'
import {SparklesIcon} from '@sanity/icons'

export const structure = (S, context) =>
  S.list()
    .title('Content')
    .items([
      S.divider(),
      S.listItem().title('Home').id('homepage').icon(HomeIcon).child(
        // Instead of rendering a list of documents, we render a single
        // document, specifying the `documentId` manually to ensure
        // that we're editing the single instance of the document
        S.document().schemaType('homepage').documentId('homepage'),
      ),
      S.divider(),
      S.listItem()
        .title('Our World')
        .icon(EarthAmericasIcon)
        .child(
          S.list()
            .title('Our World')
            .items([
              S.listItem()
                .title('About Nada Debs')
                .id('about')
                .icon(DocumentIcon)
                .child(S.document().schemaType('about').documentId('about')),
              S.listItem()
                .title('Contemporary Crafts')
                .icon(FolderIcon)
                .child(
                  S.list()
                    .title('Contemporary Crafts')
                    .items([
                      S.listItem()
                        .title('Contemporary Crafts')
                        .id('contemporaryCraftsIndex')
                        .icon(DocumentIcon)
                        .child(S.document().schemaType('crafts').documentId('crafts')),
                      S.listItem()
                        .title('Crafts')
                        .id('crafts')
                        .icon(FolderIcon)
                        .child(S.documentTypeList('craft')),
                    ]),
                ),
            ])
      ),
      S.listItem()
        .title('Studio')
        .icon(SparklesIcon)
        .child(
          S.list()
            .title('Studio')
            .items([
              S.listItem()
                .title('Studio')
                .id('studioIndex')
                .icon(DocumentIcon)
                .child(S.document().schemaType('studio').documentId('studio')),
              S.listItem()
                .title('Collaborations')
                .icon(FolderIcon)
                .child(
                  S.list()
                    .title('Collaborations')
                    .items([
                      S.listItem()
                        .title('Collaborations')
                        .id('collaborationsIndex')
                        .icon(DocumentIcon)
                        .child(S.document().schemaType('collaborations').documentId('collaborations')),
                      S.listItem()
                        .title('Projects')
                        .id('collaborations')
                        .icon(FolderIcon)
                        .child(S.documentTypeList('collaboration')),
                    ]),
                ),
              S.listItem()
                .title('Interiors')
                .icon(FolderIcon)
                .child(
                  S.list()
                    .title('Interiors')
                    .items([
                      S.listItem()
                        .title('Interiors')
                        .id('interiorsIndex')
                        .icon(DocumentIcon)
                        .child(S.document().schemaType('interiors').documentId('interiors')),
                      S.listItem()
                        .title('Projects')
                        .id('interiors')
                        .icon(FolderIcon)
                        .child(S.documentTypeList('interior')),
                    ]),
                ),
              S.listItem()
                .title('Bespoke')
                .id('bespoke')
                .icon(DocumentIcon)
                .child(S.document().schemaType('bespoke').documentId('bespoke')),
            ]),
        ),
      S.divider(),
      S.listItem()
        .title('News')
        .icon(FolderIcon)
        .child(
          S.list()
            .title('News')
            .items([
              S.listItem()
                .title('Latest')
                .icon(FolderIcon)
                .child(
                  S.list()
                    .title('Latest')
                    .items([
                      S.listItem()
                        .title('Latest')
                        .id('latestIndex')
                        .icon(DocumentIcon)
                        .child(S.document().schemaType('news').documentId('news')),
                      S.listItem()
                        .title('Posts')
                        .id('news')
                        .icon(FolderIcon)
                        .child(S.documentTypeList('post')),
                    ])
                ),
              S.listItem()
                .title('Press')
                .id('press')
                .icon(DocumentIcon)
                .child(S.document().schemaType('press').documentId('press')),
              S.listItem()
                .title('Awards')
                .id('awards')
                .icon(DocumentIcon)
                .child(S.document().schemaType('awards').documentId('awards')),
            ])
        ),
      S.listItem()
        .title('Connect')
        .icon(FolderIcon)
        .child(
          S.list()
            .title('Connect')
            .items([
              S.listItem()
                .title('Find us')
                .id('findUs')
                .icon(DocumentIcon)
                .child(S.document().schemaType('findUs').documentId('findUs')),
              S.listItem()
                .title('Contact us')
                .id('contact')
                .icon(DocumentIcon)
                .child(S.document().schemaType('contact').documentId('contact')),
            ])
        ),
      S.listItem()
        .title('Work with us')
        .icon(FolderIcon)
        .child(
          S.list()
            .title('Work with us')
            .items([
              S.listItem()
                .title('Work with us')
                .id('workWithUs')
                .icon(DocumentIcon)
                .child(S.document().schemaType('workWithUs').documentId('workWithUs')),
              S.listItem()
                .title('Open Positions')
                .id('positions')
                .icon(FolderIcon)
                .child(S.documentTypeList('position')),
            ])
        ),
      S.listItem()
        .title('Info')
        .icon(FolderIcon)
        .child(
          S.documentTypeList('legal')
        ),
      S.divider(),
      S.listItem()
        .title('Global')
        .id('siteConfig')
        .icon(CogIcon)
        .child(S.document().schemaType('siteConfig').documentId('siteConfig')),
        S.divider(),
    ])
