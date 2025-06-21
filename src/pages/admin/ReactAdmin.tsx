import { Admin, Resource, ListGuesser, EditGuesser, ShowGuesser } from 'react-admin';
import { supabaseDataProvider, supabaseAuthProvider } from 'ra-supabase';
import { supabase } from '../../lib/supabase';
import { ENV } from '../../config/env';
import { 
  Users, 
  Building2, 
  Heart, 
  FileCheck, 
  UserCheck,
  Calendar,
  ClipboardList,
  Clock
} from 'lucide-react';

// Import custom resources (to be created)
import { CharityList, CharityEdit, CharityShow } from './resources/charities';
import { CharityApprovalList } from './resources/charityApprovals';
import { ProfileUpdateApprovalList } from './resources/profileUpdateApprovals';
import { VolunteerOpportunityList, VolunteerOpportunityEdit, VolunteerOpportunityShow } from './resources/volunteerOpportunities';
import { VolunteerApplicationList, VolunteerApplicationShow } from './resources/volunteerApplications';
import { DonationList, DonationShow } from './resources/donations';
import { UserList, UserEdit, UserShow } from './resources/users';

const dataProvider = supabaseDataProvider({
  instanceUrl: ENV.SUPABASE_URL,
  apiKey: ENV.SUPABASE_ANON_KEY,
  supabaseClient: supabase
});

const authProvider = supabaseAuthProvider(supabase, {
  getPermissions: async (params) => {
    const { data: profile } = await supabase
      .from('profiles')
      .select('type')
      .eq('id', params.id)
      .single();
    return profile?.type || 'donor';
  }
});

export const ReactAdminApp = () => {
  return (
    <Admin 
      dataProvider={dataProvider} 
      authProvider={authProvider}
      requireAuth
    >
      {/* User Management */}
      <Resource
        name="profiles"
        list={UserList}
        edit={UserEdit}
        show={UserShow}
        icon={Users}
        options={{ label: 'Users' }}
      />
      
      {/* Charity Management */}
      <Resource
        name="charity_details"
        list={CharityList}
        edit={CharityEdit}
        show={CharityShow}
        icon={Building2}
        options={{ label: 'Charities' }}
      />
      
      {/* Charity Approvals */}
      <Resource
        name="charity_approvals"
        list={CharityApprovalList}
        icon={UserCheck}
        options={{ label: 'Charity Approvals' }}
      />
      
      {/* Profile Update Approvals */}
      <Resource
        name="profile_update_approvals"
        list={ProfileUpdateApprovalList}
        icon={FileCheck}
        options={{ label: 'Profile Update Approvals' }}
      />
      
      {/* Volunteer Opportunities */}
      <Resource
        name="volunteer_opportunities"
        list={VolunteerOpportunityList}
        edit={VolunteerOpportunityEdit}
        show={VolunteerOpportunityShow}
        icon={Calendar}
        options={{ label: 'Volunteer Opportunities' }}
      />
      
      {/* Volunteer Applications */}
      <Resource
        name="volunteer_applications"
        list={VolunteerApplicationList}
        show={VolunteerApplicationShow}
        icon={ClipboardList}
        options={{ label: 'Volunteer Applications' }}
      />
      
      {/* Volunteer Hours */}
      <Resource
        name="volunteer_hours"
        list={ListGuesser}
        icon={Clock}
        options={{ label: 'Volunteer Hours' }}
      />
      
      {/* Donations */}
      <Resource
        name="donations"
        list={DonationList}
        show={DonationShow}
        icon={Heart}
        options={{ label: 'Donations' }}
      />
    </Admin>
  );
};