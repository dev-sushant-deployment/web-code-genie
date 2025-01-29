import { getCode } from "@/actions/code";
import { Workspace } from "@/components/client/Workspace"

interface WorkspacePageProps {
  params: Promise<{ id: string; }>;
  searchParams: Promise<{ token: string; prompt?: string; }>;
}

const WorkspacePage : React.FC<WorkspacePageProps> = async ({ params, searchParams }) => {
  const { id } = await params;
  const { token } = await searchParams;
  const { data, error, status } = await getCode(token, id);
  if (error && status) throw new Error(error);
  if (!data) throw new Error('An unexpected error occurred');
  const { id : codeId, chat, files } = data;
  return (
    <Workspace
      codeId={codeId}
      initialChat={chat}
      initialCodeFiles={files}
    />
  )
}

export default WorkspacePage;