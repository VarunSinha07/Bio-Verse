import DashboardPage from '@/components/pages/dashboard-page';
import QuestionnairePage from '@/components/pages/questionnaire-page';
import { getUser } from '@/lib/db/getUser';
import { Session } from '@/lib/session';
import { redirect } from 'next/navigation';

const Page = async () => {
  const session = await Session();

  if (!session?.user?.id) {
    return null;
  }

  const user = await getUser(session.user.id);

  if (!user) {
    return null;
  }

  
  if (user.userRole === 'admin') {
    redirect('/admin-dashboard');
  }
  if (user.userRole === 'mentor') {
    redirect('/mentor-dashboard');
  }

  if (!user.hasCompletedQuestionnaire) {
    return <QuestionnairePage />;
  }
  return <DashboardPage />;
};

export default Page;
