import { Dot, Link } from "lucide-react";
import { CollectionPopover } from "./collection_popover";

interface collectionLinkProps {
    id: string;
    name: string;
    color: string;
}


export function CollectionLink({id, name, color}: collectionLinkProps) {

    <Link
    to={`/collections/${id}`}
    className='group flex w-full flex-row items-center justify-between rounded-lg border-2 border-transparent px-2 py-1 transition bg-gray-100 font-semibold text-gray-900'
    key={`to-collection${id}`}
    >
    <div className='flex flex-row items-center justify-start truncate'>
        <div className='mr-1.5 flex h-5 w-5 items-center justify-center'>
        <Dot color={color} size={'auto'} />
        </div>
        <p className='truncate text-sm'>{name}</p>
    </div>
    <CollectionPopover />
    </Link>
}