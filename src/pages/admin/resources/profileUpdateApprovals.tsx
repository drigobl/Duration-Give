import {
  List,
  Datagrid,
  TextField,
  DateField,
  SelectField,
  FunctionField,
  FilterButton,
  TopToolbar,
  ShowButton,
  Show,
  SimpleShowLayout,
  useRecordContext,
  useNotify,
  useRefresh,
  useDataProvider,
  Button,
} from 'react-admin';
import { CheckCircle, XCircle } from 'lucide-react';

const statusChoices = [
  { id: 'pending', name: 'Pending' },
  { id: 'approved', name: 'Approved' },
  { id: 'rejected', name: 'Rejected' },
];

const ApprovalActions = () => {
  const record = useRecordContext();
  const notify = useNotify();
  const refresh = useRefresh();
  const dataProvider = useDataProvider();

  const handleApprove = async () => {
    try {
      // Update the approval record
      await dataProvider.update('profile_update_approvals', {
        id: record.id,
        data: {
          status: 'approved',
          reviewed_by: localStorage.getItem('userId'),
          reviewed_at: new Date().toISOString(),
        },
        previousData: record,
      });
      
      // Apply the updates to charity_details
      const updates: any = {};
      if (record.new_name) updates.name = record.new_name;
      if (record.new_description) updates.description = record.new_description;
      if (record.new_category) updates.category = record.new_category;
      if (record.new_image_url) updates.image_url = record.new_image_url;
      
      await dataProvider.update('charity_details', {
        id: record.charity_id,
        data: updates,
        previousData: {},
      });
      
      notify('Profile update approved and applied', { type: 'success' });
      refresh();
    } catch (error) {
      notify('Error approving profile update', { type: 'error' });
    }
  };

  const handleReject = async () => {
    try {
      await dataProvider.update('profile_update_approvals', {
        id: record.id,
        data: {
          status: 'rejected',
          reviewed_by: localStorage.getItem('userId'),
          reviewed_at: new Date().toISOString(),
        },
        previousData: record,
      });
      
      notify('Profile update rejected', { type: 'success' });
      refresh();
    } catch (error) {
      notify('Error rejecting profile update', { type: 'error' });
    }
  };

  if (record.status !== 'pending') {
    return null;
  }

  return (
    <div style={{ display: 'flex', gap: '8px' }}>
      <Button
        onClick={handleApprove}
        label="Approve"
        startIcon={<CheckCircle />}
        variant="contained"
        color="success"
      />
      <Button
        onClick={handleReject}
        label="Reject"
        startIcon={<XCircle />}
        variant="contained"
        color="error"
      />
    </div>
  );
};

const ListActions = () => (
  <TopToolbar>
    <FilterButton />
  </TopToolbar>
);

const FieldComparison = ({ label, currentValue, newValue }: { label: string; currentValue: any; newValue: any }) => {
  if (!newValue || currentValue === newValue) return null;
  
  return (
    <div style={{ marginBottom: '16px' }}>
      <strong>{label}:</strong>
      <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
        <div style={{ flex: 1, padding: '8px', backgroundColor: '#fee', borderRadius: '4px' }}>
          <small>Current:</small><br />
          {currentValue || 'N/A'}
        </div>
        <div style={{ flex: 1, padding: '8px', backgroundColor: '#efe', borderRadius: '4px' }}>
          <small>New:</small><br />
          {newValue}
        </div>
      </div>
    </div>
  );
};

export const ProfileUpdateApprovalList = () => (
  <List actions={<ListActions />} filters={[
    <SelectInput source="status" choices={statusChoices} alwaysOn />,
  ]}>
    <Datagrid>
      <FunctionField
        label="Charity"
        render={(record: any) => record.current_name || 'Unknown'}
      />
      <FunctionField
        label="Changes Requested"
        render={(record: any) => {
          const changes = [];
          if (record.new_name && record.new_name !== record.current_name) changes.push('Name');
          if (record.new_description && record.new_description !== record.current_description) changes.push('Description');
          if (record.new_category && record.new_category !== record.current_category) changes.push('Category');
          if (record.new_image_url && record.new_image_url !== record.current_image_url) changes.push('Image');
          return changes.join(', ') || 'None';
        }}
      />
      <TextField source="update_reason" label="Reason" />
      <SelectField source="status" choices={statusChoices} label="Status" />
      <DateField source="created_at" label="Submitted" />
      <DateField source="reviewed_at" label="Reviewed" />
      <ApprovalActions />
      <ShowButton />
    </Datagrid>
  </List>
);

export const ProfileUpdateApprovalShow = () => (
  <Show>
    <SimpleShowLayout>
      <FunctionField
        label="Requested Changes"
        render={(record: any) => (
          <div>
            <FieldComparison
              label="Name"
              currentValue={record.current_name}
              newValue={record.new_name}
            />
            <FieldComparison
              label="Description"
              currentValue={record.current_description}
              newValue={record.new_description}
            />
            <FieldComparison
              label="Category"
              currentValue={record.current_category}
              newValue={record.new_category}
            />
            <FieldComparison
              label="Image URL"
              currentValue={record.current_image_url}
              newValue={record.new_image_url}
            />
          </div>
        )}
      />
      <TextField source="update_reason" label="Reason for Update" />
      <SelectField source="status" choices={statusChoices} label="Status" />
      <TextField source="review_notes" label="Review Notes" />
      <DateField source="created_at" label="Submitted" showTime />
      <DateField source="reviewed_at" label="Reviewed" showTime />
    </SimpleShowLayout>
  </Show>
);