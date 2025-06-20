import { List, Datagrid, TextField, EditButton, Edit, SimpleForm, TextInput, SelectInput, Show, SimpleShowLayout, ShowButton } from 'react-admin';

const categoryChoices = [
  { id: 'education', name: 'Education' },
  { id: 'health', name: 'Health' },
  { id: 'environment', name: 'Environment' },
  { id: 'social', name: 'Social Services' },
  { id: 'animals', name: 'Animal Welfare' },
  { id: 'arts', name: 'Arts & Culture' },
  { id: 'other', name: 'Other' },
];

export const CharityList = () => (
  <List>
    <Datagrid>
      <TextField source="name" />
      <TextField source="category" />
      <TextField source="total_received" />
      <TextField source="available_balance" />
      <EditButton />
      <ShowButton />
    </Datagrid>
  </List>
);

export const CharityEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="name" />
      <TextInput source="description" multiline rows={4} />
      <SelectInput source="category" choices={categoryChoices} />
      <TextInput source="image_url" />
    </SimpleForm>
  </Edit>
);

export const CharityShow = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="name" />
      <TextField source="description" />
      <TextField source="category" />
      <TextField source="image_url" />
      <TextField source="total_received" />
      <TextField source="available_balance" />
    </SimpleShowLayout>
  </Show>
);