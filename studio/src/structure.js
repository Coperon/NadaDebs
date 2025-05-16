import {orderableDocumentListDeskItem} from '@sanity/orderable-document-list'

// icons: https://react-icons.github.io/react-icons/search/
import { HiOutlineHome } from "react-icons/hi2";
import {RxAvatar} from 'react-icons/rx'
import {IoDocumentsOutline} from 'react-icons/io5'
import {TagsIcon} from '@sanity/icons'
import {IoSettingsOutline} from 'react-icons/io5'
import {GrNavigate} from 'react-icons/gr'
import {CiGrid42} from 'react-icons/ci'
import {BsMailbox} from 'react-icons/bs'
import { FaShopify } from "react-icons/fa";
import { HiOutlineFolder } from "react-icons/hi2";
import { HiOutlineDocument } from "react-icons/hi2";

export const structure = (S, context) =>
  S.list()
    .title('Content')
    .items([
      S.divider(),
      S.listItem().title('Homepage').id('homepage').icon(HiOutlineHome).child(
        // Instead of rendering a list of documents, we render a single
        // document, specifying the `documentId` manually to ensure
        // that we're editing the single instance of the document
        S.document().schemaType('homepage').documentId('homepage'),
      ),
      S.divider(),
      S.listItem().title('Studio').id('studio').icon(HiOutlineDocument).child(
        S.document().schemaType('studio').documentId('studio'),
      ),
      S.listItem()
        .title('Collaborations')
        .icon(HiOutlineFolder)
        .child(
          S.list()
            .title('Collaborations')
            .items([
              S.listItem()
                .title('Index Page')
                .id('collaborationsIndex')
                .icon(HiOutlineDocument)
                .child(S.document().schemaType('collaborations').documentId('collaborations')),
              S.listItem()
                .title('Collaborations')
                .id('collaborations')
                .icon(HiOutlineFolder)
                .child(S.documentTypeList('collaboration')),
            ])
        ),
      // S.listItem().title('Collaborations - Index').id('collaborations').icon(HiOutlineDocument).child(
      //   S.document().schemaType('collaborations').documentId('collaborations'),
      // ),
      // S.listItem().title(`Collaborations - All`).icon(HiOutlineFolder).child(S.documentTypeList('collaboration')),
      S.divider(),
      S.listItem()
        .title('About')
        .id('about')
        .icon(RxAvatar)
        .child(S.document().schemaType('about').documentId('about')),
      S.listItem()
        .title('Contact')
        .id('contact')
        .icon(BsMailbox)
        .child(S.document().schemaType('contact').documentId('contact')),
      S.divider(),
      S.listItem().title(`Other Pages`).child(S.documentTypeList('page')).icon(IoDocumentsOutline),
      S.divider(),
      S.listItem()
        .title('Work Page')
        .id('projectsArchive')
        .icon(CiGrid42)
        .child(S.document().schemaType('projectsArchive').documentId('projectsArchive')),
      S.listItem().title(`Projects`).child(S.documentTypeList('project')),
      /* TODO: default order should be first? */
      // allow custom reordering tab for projects
      orderableDocumentListDeskItem({
        type: 'project',
        title: 'Reorder',
        createIntent: false,
        S,
        context,
      }),
      S.listItem().title('Categories').child(S.documentTypeList('category')).icon(TagsIcon),
      S.divider(),
      S.listItem()
      .title('Shop Page')
      .id('shopArchive')
      .icon(FaShopify)
      .child(S.document().schemaType('shopArchive').documentId('shopArchive')),
      S.listItem().title(`Products`).child(S.documentTypeList('product')),
      /* TODO: default order should be first? */
      // allow custom reordering tab for projects
      orderableDocumentListDeskItem({
        type: 'product',
        title: 'Reorder',
        createIntent: false,
        S,
        context,
      }),
      S.divider(),
      S.listItem().title('Nav menus').child(S.documentTypeList('navigation')).icon(GrNavigate),
      S.divider(),
      S.listItem()
        .title('Site Global Settings')
        .id('siteConfig')
        .icon(IoSettingsOutline)
        .child(S.document().schemaType('siteConfig').documentId('siteConfig')),
        S.divider(),
    ])
