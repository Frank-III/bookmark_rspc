import { rspc } from "../../utils/rspc";
import { useLinkDetailStore } from "../../store";





// TODO: finish this when collab is finished  
export function LinkDetailCard() {
  const linkId = useLinkDetailStore().linkId;
  const {data: linkDetail, status, } = rspc.useQuery(['links.getById', linkId], {
    keepPreviousData: true,
  })


  return(
  <div>

  </div>
  )
}