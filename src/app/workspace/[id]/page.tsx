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
  const { id : codeId, chat, files, title } = data;
  let uniqueChat : {
    message: string;
    type: 'PROMPT' | 'RESPONSE';
  }[] = [];
  chat.forEach(({ message, type }, index) => {
    if (index >= 3) {
      if (type == 'RESPONSE') {
        if (chat[index -3].type == chat[index - 1].type && chat[index - 3].message == chat[index - 1].message) {
          uniqueChat = uniqueChat.slice(0, -3);
          uniqueChat.push(chat[index - 1]);
        }
      }
    }
    uniqueChat.push({ message, type });
  });
  return (
    <Workspace
      initialCodeId={codeId}
      initialTitle={title}
      initialChat={uniqueChat}
      initialCodeFiles={files}
    />
  )
}

export default WorkspacePage;