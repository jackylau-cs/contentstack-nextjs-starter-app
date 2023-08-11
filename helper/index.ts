import { addEditableTags } from "@contentstack/utils";
import { Page, BlogPosts } from "../typescript/pages";
import getConfig from "next/config";
import { FooterProps, HeaderProps } from "../typescript/layout";
import { getEntry, getEntryByUrl } from "../contentstack-sdk";

const { publicRuntimeConfig } = getConfig();
const envConfig = process.env.CONTENTSTACK_API_KEY
  ? process.env
  : publicRuntimeConfig;

const liveEdit = envConfig.CONTENTSTACK_LIVE_EDIT_TAGS === "true";

export const getHeaderRes = async (): Promise<HeaderProps> => {
  const response = (await getEntry({
    contentTypeUid: `${envConfig.CONTENTSTACK_MULTISITE_PREFIX}header`,
    referenceFieldPath: ["navigation_menu.page_reference"],
    jsonRtePath: ["notification_bar.announcement_text"],
  })) as HeaderProps[][];

  liveEdit && addEditableTags(response[0][0], `${envConfig.CONTENTSTACK_MULTISITE_PREFIX}header`, true);
  return response[0][0];
};

export const getFooterRes = async (): Promise<FooterProps> => {
  const response = (await getEntry({
    contentTypeUid: `${envConfig.CONTENTSTACK_MULTISITE_PREFIX}footer`,
    referenceFieldPath: undefined,
    jsonRtePath: ["copyright"],
  })) as FooterProps[][];
  liveEdit && addEditableTags(response[0][0], `${envConfig.CONTENTSTACK_MULTISITE_PREFIX}footer`, true);
  return response[0][0];
};

export const getAllEntries = async (): Promise<Page[]> => {
  const response = (await getEntry({
    contentTypeUid: `${envConfig.CONTENTSTACK_MULTISITE_PREFIX}page`,
    referenceFieldPath: undefined,
    jsonRtePath: undefined,
  })) as Page[][];
  liveEdit &&
    response[0].forEach((entry) => addEditableTags(entry, `${envConfig.CONTENTSTACK_MULTISITE_PREFIX}page`, true));
  return response[0];
};

export const getPageRes = async (entryUrl: string): Promise<Page> => {
  const response = (await getEntryByUrl({
    contentTypeUid: `${envConfig.CONTENTSTACK_MULTISITE_PREFIX}page`,
    entryUrl,
    referenceFieldPath: ["page_components.from_blog.featured_blogs"],
    jsonRtePath: [
      "page_components.from_blog.featured_blogs.body",
      "page_components.section_with_buckets.buckets.description",
      "page_components.section_with_html_code.description",
    ],
  })) as Page[];
  liveEdit && addEditableTags(response[0], `${envConfig.CONTENTSTACK_MULTISITE_PREFIX}page`, true);
  return response[0];
};

export const getBlogListRes = async (): Promise<BlogPosts[]> => {
  const response = (await getEntry({
    contentTypeUid: `${envConfig.CONTENTSTACK_MULTISITE_PREFIX}blog_post`,
    referenceFieldPath: ["author", "related_post"],
    jsonRtePath: ["body"],
  })) as BlogPosts[][];
  liveEdit &&
    response[0].forEach((entry) => addEditableTags(entry, `${envConfig.CONTENTSTACK_MULTISITE_PREFIX}blog_post`, true));
  return response[0];
};

export const getBlogPostRes = async (entryUrl: string): Promise<BlogPosts> => {
  const response = (await getEntryByUrl({
    contentTypeUid: `${envConfig.CONTENTSTACK_MULTISITE_PREFIX}blog_post`,
    entryUrl,
    referenceFieldPath: ["author", "related_post"],
    jsonRtePath: ["body", "related_post.body"],
  })) as BlogPosts[];
  liveEdit && addEditableTags(response[0], `${envConfig.CONTENTSTACK_MULTISITE_PREFIX}blog_post`, true);
  return response[0];
};
