import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { NewTagForm } from './create_tag_forms';
import { NewCollectionForm } from './new_collection_forms';
import { NewLinkForm } from './new_link_forms';

export function TabNewForm() {
  return (
    <Tabs defaultValue='link' className='w-[400px] flex flex-col'>
      <TabsList className='mx-auto'>
        <TabsTrigger value='link'>🔗 Link</TabsTrigger>
        <TabsTrigger value='collection'>📚 Collection</TabsTrigger>
        <TabsTrigger value='tag'>🏷️ Tag</TabsTrigger>
      </TabsList>
      <TabsContent value='link'>
        <NewLinkForm />
      </TabsContent>
      <TabsContent value='collection'>
        <NewCollectionForm />
      </TabsContent>
      <TabsContent value='tag'>
        <NewTagForm />
      </TabsContent>
    </Tabs>
  );
}
