// This file was generated by [rspc](https://github.com/oscartbeaumont/rspc). Do not edit this file manually.

export type Procedures = {
    queries: 
        { key: "collections.getByUser", input: never, result: Collection[] } | 
        { key: "links.getPinned", input: never, result: User | null } | 
        { key: "tags.getByUser", input: never, result: Tag[] } | 
        { key: "users.get", input: never, result: User | null } | 
        { key: "version", input: never, result: string },
    mutations: 
        { key: "links.create", input: CreateLinkArgs, result: Link } | 
        { key: "tags.create", input: CreateTagArgs, result: Tag } | 
        { key: "tags.edit", input: UpdateTagArgs, result: Tag },
    subscriptions: never
};

export type CreateTagArgs = { tag_name: string }

export type User = { id: string; created_at: string | null; updated_at: string | null; username: string; name: string; email: string }

export type Collection = { id: number; name: string; description: string; color: string; isPublic: boolean; ownerId: string; createdAt: string }

export type CreateLinkArgs = { link_name: string; url: string; description: string | null; collection_id: number }

export type Link = { id: number; name: string; url: string; description: string; collectionId: number; createdAt: string }

export type Tag = { id: number; name: string; ownerId: string }

export type UpdateTagArgs = { tag_id: number; tag_name: string }
