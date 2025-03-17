import React from "react";

type BlockNames = string[];

/**
 * Components
 */
type ImageProps = {
  id: number;
  url: string;
  alt: string;
  width: number;
  height: number;
  title: string;
  loading: "lazy" | "eager";
};

export const FocalPointImage: React.FC<
  ImageProps & {
    focalPoint: {
      x: number;
      y: number;
    };
  }
>;

export const Image: React.FC<ImageProps>;

export const ImageControl: React.FC<{
  id: number;
  fallback: string;
  onSelect: (image: object) => void;
  onRemove: () => void;
  title: string;
  setLabel: string;
  replaceLabel: string;
  removeLabel: string;
  showPreview: boolean;
}>;

export const InlineNotice: React.FC<{
  status: "warning" | "error";
  size: "regular" | "small";
}>;

export const PostControl: React.FC<{
  label: string;
  posts: any[];
  value: number;
  onChange: (...args: any[]) => any;
}>;

export const RequireBlocks: React.FC<{
  blocks: BlockNames;
}>;

export const SortablePostsControl: React.FC<{
  label: string;
  posts: any[];
  value: number[];
  onChange: (...args: any[]) => any;
}>;

export const SortablePostSearchControl: React.FC<{
  type: string;
  status: string;
  value: number[];
  onChange: (...args: any[]) => any;
  placeholder: string;
  label: string;
  inputProps: object;
  filterResults: (results: any[]) => any[];
  numOfInitialResults: number;
}>;

export const TaxonomyControl: React.FC<{
  slug: string;
  label: string;
  value: any[];
  onChange: (...args: any[]) => any;
}>;

export const PostSearchControl: React.FC<{
  type: string;
  status: string;
  value: number;
  onChange: (...args: any[]) => any;
  placeholder: string;
  label: string;
  inputProps: object;
  filterResults: (results: any[]) => any[];
  numOfInitialResults: number;
}>;

/**
 * Hooks
 */

export function useAllPosts(postType: string): any[];

export function useRequiredBlocks(requiredBlocks: BlockNames): {
  missingBlocks: BlockNames;
  hasRequiredBlocks: boolean;
};

export function usePost(postType: string, id: number): any;

export function usePostSearch(postType: string, search: string): any[];

/**
 * Utils
 */

export const utils: {
  labelWithCount: (label: string, count: number) => string;
  postToControlOptions: (post: object) => {
    id: number;
    label: string;
    value: number;
  };
  pickImageProps: (
    uploadObject: object,
    size: string
  ) => {
    alt: string;
    id: number;
    width: number;
    height: number;
    url: string;
    title: string;
  };
};
