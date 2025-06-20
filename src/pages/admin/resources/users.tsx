import { List, Datagrid, TextField, DateField, EditButton, Edit, SimpleForm, TextInput, SelectInput, Show, SimpleShowLayout, ShowButton } from 'react-admin';

const typeChoices = [
  { id: 'donor', name: 'Donor' },
  { id: 'charity', name: 'Charity' },
  { id: 'admin', name: 'Admin' },
];

export const UserList = () => (
  <List>
    <Datagrid>
      <TextField source="id" />
      <TextField source="user_id" />
      <SelectField source="type" choices={typeChoices} />
      <DateField source="created_at" />
      <EditButton />
      <ShowButton />
    </Datagrid>
  </List>
);

export const UserEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="user_id" disabled />
      <SelectInput source="type" choices={typeChoices} />
    </SimpleForm>
  </Edit>
);

export const UserShow = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="user_id" />
      <SelectField source="type" choices={typeChoices} />
      <DateField source="created_at" showTime />
    </SimpleShowLayout>
  </Show>
);