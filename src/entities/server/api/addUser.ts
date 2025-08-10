import { db } from '@/shared/api';

interface props {
  inviteCode: string;
  profileId: string;
}
export const addUser = async ({ inviteCode, profileId }: props) => {
  return db.server.update({
    where: {
      inviteCode: inviteCode,
    },
    data: {
      members: {
        create: [
          {
            profileId: profileId,
          },
        ],
      },
    },
  });
};
