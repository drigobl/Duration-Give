import { List, Datagrid, TextField, DateField, EmailField, SelectField, Show, SimpleShowLayout, ShowButton, ArrayField, ChipField, SingleFieldList } from 'react-admin';

const statusChoices = [
  { id: 'pending', name: 'Pending' },
  { id: 'approved', name: 'Approved' },
  { id: 'rejected', name: 'Rejected' },
];

const commitmentChoices = [
  { id: 'one-time', name: 'One-time' },
  { id: 'short-term', name: 'Short-term' },
  { id: 'long-term', name: 'Long-term' },
];

export const VolunteerApplicationList = () => (
  <List>
    <Datagrid>
      <TextField source="full_name" />
      <EmailField source="email" />
      <TextField source="phone_number" />
      <SelectField source="commitment_type" choices={commitmentChoices} />
      <SelectField source="status" choices={statusChoices} />
      <DateField source="created_at" />
      <ShowButton />
    </Datagrid>
  </List>
);

export const VolunteerApplicationShow = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="full_name" />
      <EmailField source="email" />
      <TextField source="phone_number" />
      <DateField source="date_of_birth" />
      <SelectField source="commitment_type" choices={commitmentChoices} />
      <TextField source="experience" />
      <ArrayField source="skills">
        <SingleFieldList>
          <ChipField source="name" size="small" />
        </SingleFieldList>
      </ArrayField>
      <ArrayField source="certifications">
        <SingleFieldList>
          <ChipField source="name" size="small" />
        </SingleFieldList>
      </ArrayField>
      <ArrayField source="interests">
        <SingleFieldList>
          <ChipField source="name" size="small" />
        </SingleFieldList>
      </ArrayField>
      <SelectField source="status" choices={statusChoices} />
      <DateField source="created_at" showTime />
      <DateField source="updated_at" showTime />
    </SimpleShowLayout>
  </Show>
);