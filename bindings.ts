// This file was generated by [rspc](https://github.com/oscartbeaumont/rspc). Do not edit this file manually.

export type Procedures = {
    queries: 
        { key: "collections.getAllWithPinned", input: never, result: CollectionWithPinnedStatus[] } | 
        { key: "collections.getById", input: number, result: Collection | null } | 
        { key: "collections.getByUser", input: never, result: Collection[] } | 
        { key: "collections.getOnePinnedStatus", input: number, result: CollectionWithPinnedStatus | null } | 
        { key: "collections.getPinned", input: never, result: PinnedCollections[] } | 
        { key: "links.archiveStatByDate", input: string | null, result: ArchiveStatData } | 
        { key: "links.getByDate", input: GetByDateArgs, result: Link[] } | 
        { key: "links.getSummary", input: string | null, result: SummariesData[] } | 
        { key: "tags.getByUser", input: never, result: Tag[] } | 
        { key: "users.get", input: never, result: User | null } | 
        { key: "version", input: never, result: string },
    mutations: 
        { key: "collections.addPinned", input: number, result: PinnedUserCollections } | 
        { key: "collections.create", input: CreateCollectionArgs, result: Collection } | 
        { key: "collections.editSingle", input: EditCollectionArgs, result: Collection } | 
        { key: "links.create", input: CreateLinkArgs, result: Link } | 
        { key: "links.deleteOne", input: number, result: Link } | 
        { key: "tags.create", input: CreateTagArgs, result: Tag } | 
        { key: "tags.delete", input: number, result: Tag } | 
        { key: "tags.edit", input: UpdateTagArgs, result: Tag },
    subscriptions: never
};

export type CollectionWithPinnedStatus = { id: number; name: string; description: string; color: string; isPublic: boolean; ownerId: string; archivedLinks: number; totalLinks: number; createdAt: string; pinnedBy: { user: { id: string } }[] }

export type CreateLinkArgs = { link_name: string; url: string; description: string | null; collection_id: number }

export type User = { id: string; created_at: string; updated_at: string; username: string; name: string; email: string; avatar: string | null; bio: string | null; connectedTG: boolean }

export type PinnedUserCollections = { userId: string; collectionId: number }

export type PinnedCollections = { collection: Collection }

export type SummariesData = { date: string; count: number }

export type GetByDateArgs = { date: string; size: number | null }

export type ArchiveStatData = { total: number; archived: number; not_archived: number }

export type CreateTagArgs = { tag_name: string; color: string }

export type Collection = { id: number; name: string; description: string; color: string; isPublic: boolean; ownerId: string; archivedLinks: number; totalLinks: number; createdAt: string }

export type Link = { id: number; name: string; url: string; description: string; archived: boolean; ownerId: string; collectionId: number; createdAt: string }

export type UpdateTagArgs = { tag_id: number; tag_name: string; color: string }

export type Tag = { id: number; name: string; color: string; ownerId: string }

export type CreateCollectionArgs = { name: string; color: string; pinned: boolean; public: boolean }

export type EditCollectionArgs = { id: number; name: string; color: string; pinned: boolean; public: boolean }
