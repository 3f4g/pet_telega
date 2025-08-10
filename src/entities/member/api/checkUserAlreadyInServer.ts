import { db } from '@/shared/api';

interface props {
  inviteCode: string;
  profileId: string;
}
export const checkUserAlreadyInServer = async ({ inviteCode, profileId }: props) => {
  return db.server.findFirst({
    where: {
      inviteCode: inviteCode,
      members: {
        some: {
          profileId: profileId,
        },
      },
    },
  });
};
