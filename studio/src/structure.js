import {orderableDocumentListDeskItem} from '@sanity/orderable-document-list'

// icons: https://react-icons.github.io/react-icons/search/
import {HomeIcon} from '@sanity/icons'
import {RxAvatar} from 'react-icons/rx'
import {IoDocumentsOutline} from 'react-icons/io5'
import {TagsIcon} from '@sanity/icons'
import {IoSettingsOutline} from 'react-icons/io5'
import {GrNavigate} from 'react-icons/gr'
import {CiGrid42} from 'react-icons/ci'
import {BsMailbox} from 'react-icons/bs'
import { FaShopify } from "react-icons/fa";
import {DocumentIcon} from '@sanity/icons'
import {FolderIcon} from '@sanity/icons'

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
        .icon(FolderIcon)
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
        .icon(FolderIcon)
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

      
      // S.listItem()
      //   .title('About')
      //   .id('about')
      //   .icon(RxAvatar)
      //   .child(S.document().schemaType('about').documentId('about')),
      // S.listItem()
      //   .title('Contact')
      //   .id('contact')
      //   .icon(BsMailbox)
      //   .child(S.document().schemaType('contact').documentId('contact')),
      // S.divider(),
      // S.listItem().title(`Other Pages`).child(S.documentTypeList('page')).icon(IoDocumentsOutline),
      // S.divider(),
      // S.listItem()
      //   .title('Work Page')
      //   .id('projectsArchive')
      //   .icon(CiGrid42)
      //   .child(S.document().schemaType('projectsArchive').documentId('projectsArchive')),
      // S.listItem().title(`Projects`).child(S.documentTypeList('project')),
      // /* TODO: default order should be first? */
      // // allow custom reordering tab for projects
      // orderableDocumentListDeskItem({
      //   type: 'project',
      //   title: 'Reorder',
      //   createIntent: false,
      //   S,
      //   context,
      // }),
      // S.listItem().title('Categories').child(S.documentTypeList('category')).icon(TagsIcon),
      // S.divider(),
      // S.listItem()
      // .title('Shop Page')
      // .id('shopArchive')
      // .icon(FaShopify)
      // .child(S.document().schemaType('shopArchive').documentId('shopArchive')),
      // S.listItem().title(`Products`).child(S.documentTypeList('product')),
      // /* TODO: default order should be first? */
      // // allow custom reordering tab for projects
      // orderableDocumentListDeskItem({
      //   type: 'product',
      //   title: 'Reorder',
      //   createIntent: false,
      //   S,
      //   context,
      // }),
      // S.divider(),
      // S.listItem().title('Nav menus').child(S.documentTypeList('navigation')).icon(GrNavigate),
      // S.divider(),
      // S.listItem()
      //   .title('Site Global Settings')
      //   .id('siteConfig')
      //   .icon(IoSettingsOutline)
      //   .child(S.document().schemaType('siteConfig').documentId('siteConfig')),
      //   S.divider(),
    ])
