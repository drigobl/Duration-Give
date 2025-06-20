import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { formatDate } from '@/utils/date';
import { 
  Clock, 
  Calendar, 
  Building2, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  FileText,
  ExternalLink
} from 'lucide-react';

interface VolunteerApplication {
  id: string;
  opportunity_id: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  opportunity: {
    title: string;
    charity_id: string;
    charity: {
      name: string;
    };
  };
}

interface VolunteerHour {
  id: string;
  charity_id: string;
  hours: number;
  description: string;
  date_performed: string;
  status: 'pending' | 'approved' | 'rejected';
  verification_hash?: string;
  charity: {
    name: string;
  };
}

export const VolunteerActivity: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState<VolunteerApplication[]>([]);
  const [hours, setHours] = useState<VolunteerHour[]>([]);
  const [activeTab, setActiveTab] = useState<'applications' | 'hours'>('applications');

  useEffect(() => {
    if (user) {
      loadVolunteerData();
    }
  }, [user]);

  const loadVolunteerData = async () => {
    try {
      setLoading(true);

      // Load volunteer applications
      const { data: applicationsData, error: appsError } = await supabase
        .from('volunteer_applications')
        .select(`
          *,
          opportunity:volunteer_opportunities(
            title,
            charity_id,
            charity:profiles!volunteer_opportunities_charity_id_fkey(
              charity_details(name)
            )
          )
        `)
        .eq('applicant_id', user!.id)
        .order('created_at', { ascending: false });

      if (appsError) throw appsError;

      // Load volunteer hours
      const { data: hoursData, error: hoursError } = await supabase
        .from('volunteer_hours')
        .select(`
          *,
          charity:profiles!volunteer_hours_charity_id_fkey(
            charity_details(name)
          )
        `)
        .eq('volunteer_id', user!.id)
        .order('date_performed', { ascending: false });

      if (hoursError) throw hoursError;

      setApplications(applicationsData || []);
      setHours(hoursData || []);
    } catch (error) {
      console.error('Error loading volunteer data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const totalHours = hours
    .filter(h => h.status === 'approved')
    .reduce((sum, h) => sum + h.hours, 0);

  const pendingHours = hours
    .filter(h => h.status === 'pending')
    .reduce((sum, h) => sum + h.hours, 0);

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex justify-center">
          <LoadingSpinner />
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
              <Clock className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Hours</p>
              <p className="text-2xl font-semibold text-gray-900">{totalHours}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <AlertCircle className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Hours</p>
              <p className="text-2xl font-semibold text-gray-900">{pendingHours}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <FileText className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Applications</p>
              <p className="text-2xl font-semibold text-gray-900">{applications.length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Activity Tabs */}
      <Card>
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            <button
              onClick={() => setActiveTab('applications')}
              className={`py-4 px-6 text-sm font-medium ${
                activeTab === 'applications'
                  ? 'border-b-2 border-indigo-500 text-indigo-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Applications ({applications.length})
            </button>
            <button
              onClick={() => setActiveTab('hours')}
              className={`py-4 px-6 text-sm font-medium ${
                activeTab === 'hours'
                  ? 'border-b-2 border-indigo-500 text-indigo-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Hours Logged ({hours.length})
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'applications' ? (
            <div className="space-y-4">
              {applications.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No volunteer applications yet. Browse opportunities to get started!
                </p>
              ) : (
                applications.map((application) => (
                  <div
                    key={application.id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-lg font-medium text-gray-900">
                          {application.opportunity.title}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          <Building2 className="inline h-4 w-4 mr-1" />
                          {application.opportunity.charity.charity_details[0]?.name || 'Unknown Charity'}
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                          <Calendar className="inline h-4 w-4 mr-1" />
                          Applied on {formatDate(application.created_at)}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(application.status)}
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            application.status
                          )}`}
                        >
                          {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {hours.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No volunteer hours logged yet. Start volunteering to track your impact!
                </p>
              ) : (
                hours.map((hour) => (
                  <div
                    key={hour.id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-lg font-medium text-gray-900">
                          {hour.hours} hours - {hour.charity.charity_details[0]?.name || 'Unknown Charity'}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">{hour.description}</p>
                        <p className="text-sm text-gray-500 mt-2">
                          <Calendar className="inline h-4 w-4 mr-1" />
                          Performed on {formatDate(hour.date_performed)}
                        </p>
                        {hour.verification_hash && hour.status === 'approved' && (
                          <a
                            href={`/verify/${hour.verification_hash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-500 mt-2"
                          >
                            <ExternalLink className="h-4 w-4 mr-1" />
                            View Verification
                          </a>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(hour.status)}
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            hour.status
                          )}`}
                        >
                          {hour.status.charAt(0).toUpperCase() + hour.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};