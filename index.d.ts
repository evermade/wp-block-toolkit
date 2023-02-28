import React from "react";

type BlockNames = string[];

/**
 * Components
 */
export const InlineNotice: React.FC<{
	status: "warning" | "error";
	size: "regular" | "small";
}> = props;

export const PostControl: React.FC<{
	label: string;
	posts: any[];
	value: number;
	onChange: (...args: any[]) => any;
}> = props;

export const RequireBlocks: React.FC<{
	blocks: BlockNames;
}> = props;

export const SortablePostsControl: React.FC<{
	label: string;
	posts: any[];
	value: number[];
	onChange: (...args: any[]) => any;
}> = props;

export const TaxonomyControl: React.FC<{
	label: string;
	taxonomies: any[];
	value: any[];
	onChange: (...args: any[]) => any;
}> = props;

export const PostSearchControl: React.FC<{
	type: string;
	value: number;
	onChange: (...args: any[]) => any;
	placeholder: string;
	label: string;
	inputProps: object;
	filterResults: (results: any[]) => any[];
	numOfInitialResults: number;
}> = props;

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
