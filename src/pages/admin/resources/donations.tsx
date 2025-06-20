import { List, Datagrid, TextField, DateField, Show, SimpleShowLayout, ShowButton, NumberField } from 'react-admin';

export const DonationList = () => (
  <List>
    <Datagrid>
      <TextField source="donor_id" label="Donor ID" />
      <TextField source="charity_id" label="Charity ID" />
      <NumberField source="amount" />
      <DateField source="created_at" showTime />
      <ShowButton />
    </Datagrid>
  </List>
);

export const DonationShow = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="donor_id" label="Donor ID" />
      <TextField source="charity_id" label="Charity ID" />
      <NumberField source="amount" />
      <DateField source="created_at" showTime />
    </SimpleShowLayout>
  </Show>
);