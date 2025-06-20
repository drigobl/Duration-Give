import { List, Datagrid, TextField, DateField, EditButton, Edit, SimpleForm, TextInput, SelectInput, Show, SimpleShowLayout, ShowButton, ArrayField, ChipField, SingleFieldList } from 'react-admin';

const commitmentChoices = [
  { id: 'one-time', name: 'One-time' },
  { id: 'short-term', name: 'Short-term' },
  { id: 'long-term', name: 'Long-term' },
];

const typeChoices = [
  { id: 'onsite', name: 'On-site' },
  { id: 'remote', name: 'Remote' },
  { id: 'hybrid', name: 'Hybrid' },
];

const statusChoices = [
  { id: 'active', name: 'Active' },
  { id: 'completed', name: 'Completed' },
  { id: 'cancelled', name: 'Cancelled' },
];

export const VolunteerOpportunityList = () => (
  <List>
    <Datagrid>
      <TextField source="title" />
      <TextField source="location" />
      <SelectField source="commitment" choices={commitmentChoices} />
      <SelectField source="type" choices={typeChoices} />
      <SelectField source="status" choices={statusChoices} />
      <DateField source="created_at" />
      <EditButton />
      <ShowButton />
    </Datagrid>
  </List>
);

export const VolunteerOpportunityEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="title" />
      <TextInput source="description" multiline rows={4} />
      <TextInput source="location" />
      <SelectInput source="commitment" choices={commitmentChoices} />
      <SelectInput source="type" choices={typeChoices} />
      <SelectInput source="status" choices={statusChoices} />
    </SimpleForm>
  </Edit>
);

export const VolunteerOpportunityShow = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="title" />
      <TextField source="description" />
      <ArrayField source="skills">
        <SingleFieldList>
          <ChipField source="name" size="small" />
        </SingleFieldList>
      </ArrayField>
      <TextField source="location" />
      <SelectField source="commitment" choices={commitmentChoices} />
      <SelectField source="type" choices={typeChoices} />
      <SelectField source="status" choices={statusChoices} />
      <DateField source="created_at" showTime />
    </SimpleShowLayout>
  </Show>
);