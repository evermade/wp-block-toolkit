import React from "react";

type BlockNames = string[];

/**
 * Components
 */
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
