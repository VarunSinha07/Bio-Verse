import ProgramDashboard from '@/components/pages/dashboard-page';
import QuestionnairePage from '@/components/pages/questionnaire-page';
import { getUser } from '@/lib/db/getUser';
import { Session } from '@/lib/session';

const Page = async () => {
  const session = await Session();

  if (!session?.user?.id) {
    return null;
  }

  const user = await getUser(session.user.id);

  if (!user?.hasCompletedQuestionnaire) {
    return <QuestionnairePage />;
  }
  return <ProgramDashboard />;
};

export default Page;
