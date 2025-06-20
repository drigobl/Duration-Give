import {
  List,
  Datagrid,
  TextField,
  DateField,
  SelectField,
  FunctionField,
  FilterButton,
  TopToolbar,
  EditButton,
  BooleanInput,
  SimpleForm,
  TextInput,
  SelectInput,
  Edit,
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

const requestTypeChoices = [
  { id: 'new_registration', name: 'New Registration' },
  { id: 'reactivation', name: 'Reactivation' },
];

const ApprovalActions = () => {
  const record = useRecordContext();
  const notify = useNotify();
  const refresh = useRefresh();
  const dataProvider = useDataProvider();

  const handleApprove = async () => {
    try {
      await dataProvider.update('charity_approvals', {
        id: record.id,
        data: {
          status: 'approved',
          reviewed_by: localStorage.getItem('userId'), // You'll need to store this
          reviewed_at: new Date().toISOString(),
        },
        previousData: record,
      });
      
      // Update the charity profile to active
      await dataProvider.update('charity_details', {
        id: record.charity_id,
        data: {
          is_active: true,
        },
        previousData: {},
      });
      
      notify('Charity approved successfully', { type: 'success' });
      refresh();
    } catch (error) {
      notify('Error approving charity', { type: 'error' });
    }
  };

  const handleReject = async () => {
    try {
      await dataProvider.update('charity_approvals', {
        id: record.id,
        data: {
          status: 'rejected',
          reviewed_by: localStorage.getItem('userId'),
          reviewed_at: new Date().toISOString(),
        },
        previousData: record,
      });
      
      notify('Charity rejected', { type: 'success' });
      refresh();
    } catch (error) {
      notify('Error rejecting charity', { type: 'error' });
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

export const CharityApprovalList = () => (
  <List actions={<ListActions />} filters={[
    <SelectInput source="status" choices={statusChoices} alwaysOn />,
    <SelectInput source="request_type" choices={requestTypeChoices} />,
  ]}>
    <Datagrid>
      <TextField source="charity_name" label="Charity Name" />
      <SelectField source="request_type" choices={requestTypeChoices} label="Request Type" />
      <TextField source="category" label="Category" />
      <SelectField source="status" choices={statusChoices} label="Status" />
      <DateField source="created_at" label="Submitted" />
      <DateField source="reviewed_at" label="Reviewed" />
      <FunctionField
        label="Documents"
        render={(record: any) => (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {record.registration_document_url && (
              <a href={record.registration_document_url} target="_blank" rel="noopener noreferrer">
                Registration Doc
              </a>
            )}
            {record.tax_certificate_url && (
              <a href={record.tax_certificate_url} target="_blank" rel="noopener noreferrer">
                Tax Certificate
              </a>
            )}
          </div>
        )}
      />
      <ApprovalActions />
      <EditButton />
    </Datagrid>
  </List>
);

export const CharityApprovalEdit = () => (
  <Edit>
    <SimpleForm>
      <TextField source="charity_name" label="Charity Name" />
      <SelectField source="request_type" choices={requestTypeChoices} label="Request Type" />
      <TextInput source="description" label="Description" multiline rows={4} />
      <TextField source="category" label="Category" />
      <TextField source="registration_number" label="Registration Number" />
      <TextField source="tax_id" label="Tax ID" />
      <SelectInput source="status" choices={statusChoices} label="Status" />
      <TextInput source="review_notes" label="Review Notes" multiline rows={3} />
      <DateField source="created_at" label="Submitted" />
      <DateField source="reviewed_at" label="Reviewed" />
    </SimpleForm>
  </Edit>
);